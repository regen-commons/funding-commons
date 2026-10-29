"""Collect bounded public primary-source evidence for Funding Commons research.

Usage: python3 scripts/collect-sources.py --batch 0 [--overrides PATH] [--ids ID,ID] [--force]
The cache is evidence for review, never a source of automatically asserted terms.
"""
import argparse, concurrent.futures, datetime, gzip, hashlib, html, io, ipaddress, json, os, re, socket, ssl, time, zlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler, HTTPSHandler
from urllib.error import HTTPError, URLError
ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cache/enrichment'
TODAY = datetime.datetime.now(datetime.timezone.utc).date().isoformat()
MAX_BYTES = 3_000_000
# macOS system Python may have no default CA path; keep TLS verification intact.
CA_FILE = os.environ.get('SSL_CERT_FILE') or ('/etc/ssl/cert.pem' if Path('/etc/ssl/cert.pem').exists() else None)
TLS = ssl.create_default_context(cafile=CA_FILE)
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip = 0; self.title = False; self.title_parts = []; self.parts = []; self.links = []; self.link = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script','style','svg','noscript','template','nav','footer'): self.skip += 1
        if tag == 'title': self.title = True
        if tag == 'a' and attrs.get('href'): self.link = [attrs['href'], []]
        if self.skip: return
        if tag in ('p','li','h1','h2','h3','h4','div','section','article','br','tr','dt','dd'): self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in ('script','style','svg','noscript','template','nav','footer'): self.skip = max(0, self.skip-1)
        if tag == 'title': self.title = False
        if tag == 'a' and self.link:
            self.links.append((self.link[0], ' '.join(self.link[1]))); self.link = None
        if tag in ('p','li','h1','h2','h3','h4','div','section','article','tr','dt','dd'): self.parts.append('\n')
    def handle_data(self, data):
        if self.title: self.title_parts.append(data)
        if self.link: self.link[1].append(data)
        if not self.skip:
            self.parts.append(data + ' ')
def public_url(value):
    u = urlsplit(value)
    if u.scheme not in ('https','http') or not u.hostname or u.username or u.password: raise ValueError('Not a public HTTP URL')
    host = u.hostname.lower()
    if host == 'localhost' or host.endswith(('.local','.internal','.localhost')): raise ValueError('Private host')
    try:
        if not ipaddress.ip_address(host).is_global: raise ValueError('Private IP')
    except ValueError as e:
        if 'Private IP' in str(e): raise
    for result in socket.getaddrinfo(host, u.port or (443 if u.scheme == 'https' else 80)):
        if not ipaddress.ip_address(result[4][0]).is_global: raise ValueError('Private network target')
    return urlunsplit((u.scheme,u.netloc,u.path or '/',u.query,''))
class PublicRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        public_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)
OPENER = build_opener(PublicRedirect(), HTTPSHandler(context=TLS))
def clean(text): return re.sub(r'[ \t\r\f\v]+',' ',text).strip()
def fetch(url):
    start=time.time(); attempt={'url':url,'checkedOn':TODAY}
    try:
        url=public_url(url)
        request=Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; FundingCommonsResearch/1.0; +https://funding-commons.adepthake1024.chatgpt.site)','Accept':'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5'})
        with OPENER.open(request,timeout=14) as response:
            final=public_url(response.url)
            attempt.update(status=response.status,finalUrl=final,contentType=response.headers.get_content_type())
            if attempt['contentType'] not in ('text/html','application/xhtml+xml','text/plain'):
                attempt.update(outcome='non_html',note='Non-HTML primary source needs separate review.'); return attempt,None
            raw=response.read(MAX_BYTES+1)
            if len(raw)>MAX_BYTES: raw=raw[:MAX_BYTES];attempt['truncated']=True
            content_encoding=response.headers.get('Content-Encoding','').lower()
            if content_encoding not in ('','identity','gzip','deflate'):
                attempt.update(outcome='unsupported_encoding',note='Compressed body needs separate source review.');return attempt,None
            if content_encoding == 'gzip' or raw.startswith(b'\x1f\x8b'):
                raw=gzip.GzipFile(fileobj=io.BytesIO(raw)).read(MAX_BYTES+1)
                if len(raw)>MAX_BYTES: raw=raw[:MAX_BYTES];attempt['truncated']=True
            if content_encoding == 'deflate': raw=zlib.decompress(raw)[:MAX_BYTES]
            encoding=response.headers.get_content_charset() or 'utf-8'
            try: text=raw.decode(encoding,errors='replace')
            except LookupError: text=raw.decode('utf-8',errors='replace')
            if text and sum(ord(c)<32 and c not in '\n\r\t' or c=='\ufffd' for c in text)/len(text)>0.05:
                attempt.update(outcome='unreadable',note='Source bytes could not be decoded reliably.');return attempt,None
            page=Page(); page.feed(text)
            lines=[clean(line) for line in ''.join(page.parts).split('\n')]; lines=list(dict.fromkeys(line for line in lines if len(line)>15))
            body='\n'.join(lines)
            title=clean(' '.join(page.title_parts)) or final
            blocked=bool(re.search(r'just a moment|access denied|attention required|checking your browser|verify you are human|bot verification', title, re.I))
            attempt.update(outcome='blocked' if blocked else 'thin' if len(body)<180 else 'retrieved',sha256=hashlib.sha256(raw).hexdigest(),characters=len(body))
            keywords=r'eligib|apply|applica|grant|funding|deadline|closing|fiscal|unsolicited|invit|registered|nonprofit|non-profit|501\(?c|budget|award|\$|€|£|USD|EUR|GBP|financi|subven|solicitu|convocat|candidatur|montant|éligib|elegib|prazo|inscri'
            excerpt=[line for line in lines if re.search(keywords,line,re.I)]
            return attempt,{'url':final,'requestedUrl':url,'title':title,'checkedOn':TODAY,'sha256':attempt['sha256'],'outcome':attempt['outcome'],'text':body[:75000],'excerpts':excerpt[:85], 'links':page.links, 'truncated':len(body)>75000 or attempt.get('truncated',False)}
    except HTTPError as e: attempt.update(outcome='http_error',status=e.code,error=str(e.reason))
    except Exception as e: attempt.update(outcome='unreachable',error=clean(str(e))[:240])
    finally: attempt['elapsedSeconds']=round(time.time()-start,2)
    return attempt,None
def candidates(page):
    base=urlsplit(page['url']); host=base.hostname.removeprefix('www.')
    out=[]
    for href,label in page['links']:
        url=urljoin(page['url'],href); p=urlsplit(url)
        if p.scheme not in ('http','https') or (p.hostname or '').removeprefix('www.')!=host or p.path.lower().endswith(('.jpg','.png','.svg','.zip','.mp4','.pdf')): continue
        text=(label+' '+p.path).lower()
        if any(x in text for x in ('privacy','cookie','login','log-in','donate','donation','contact','press','news','event','report','annual')): continue
        score=sum(weight for pattern,weight in [('eligib',12),('apply',11),('application',10),('grantseek',12),('grant-seek',12),('grantmaking',12),('grant',7),('criteria',10),('for-nonprofits',11),('for-grantees',11),('guideline',11),('faq',10),('grants',9),('funding',8),('financi',7),('convocat',7),('solicit',7),('what-we-fund',11),('how-we-fund',11),('about',2),('mission',3)] if pattern in text)
        if score: out.append((score,urlunsplit((p.scheme,p.netloc,p.path,p.query,''))))
    return [url for _,url in sorted(set(out),reverse=True)]
def collect(fund,overrides,force,pages=3):
    path=CACHE/(fund['id']+'.json')
    seed=overrides.get(fund['id']) or fund.get('evidenceUrl') or fund.get('website')
    if path.exists() and not force:
        old=json.loads(path.read_text())
        if old.get('seedUrl')==seed: return old
    record={'sourceRecordId':fund['id'],'name':fund['name'],'checkedOn':TODAY,'seedUrl':seed or '', 'attempts':[],'pages':[]}
    if not seed: record['outcome']='no_website'
    else:
        attempt,page=fetch(seed);record['attempts'].append(attempt)
        if page:
            record['pages'].append(page)
            urls=candidates(page)
            if fund.get('website') and urlsplit(seed).path not in ('','/') and fund['website']!=seed: urls.append(fund['website'])
            visited={seed,page['url']}
            while urls and len(record['attempts'])<pages:
                url=urls.pop(0)
                if url in visited:continue
                visited.add(url)
                time.sleep(0.25)
                attempt,sub=fetch(url);record['attempts'].append(attempt)
                if sub:
                    record['pages'].append(sub)
                    urls=list(dict.fromkeys(candidates(sub)+urls))
        record['outcome']='retrieved' if any(p['outcome']=='retrieved' for p in record['pages']) else record['attempts'][0]['outcome']
    path.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
    return record
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--batch',type=int,choices=range(3),required=True);parser.add_argument('--overrides');parser.add_argument('--ids');parser.add_argument('--force',action='store_true');parser.add_argument('--pages',type=int,choices=range(1,7),default=3);args=parser.parse_args()
    funds=json.loads((ROOT/f'research/batches/batch-{args.batch}.json').read_text())
    if args.ids: funds=[f for f in funds if f['id'] in args.ids.split(',')]
    overrides=json.loads(Path(args.overrides).read_text()) if args.overrides else {}
    CACHE.mkdir(parents=True,exist_ok=True)
    counts={}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        jobs=[pool.submit(collect,f,overrides,args.force,args.pages) for f in funds]
        for i,job in enumerate(concurrent.futures.as_completed(jobs),1):
            result=job.result(); outcome=result['outcome'];counts[outcome]=counts.get(outcome,0)+1
            if i%20==0 or i==len(jobs): print(json.dumps({'completed':i,'total':len(jobs),'outcomes':counts}),flush=True)
