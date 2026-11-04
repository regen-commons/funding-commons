import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {beforeProgramRevisions,inputBeforeRevisions,loadRevisions} from '../../scripts/revision-history.mjs';
const root=new URL('../../',import.meta.url);
export const auditCatalog=data=>beforeProgramRevisions(data,root);
export const auditInput=path=>inputBeforeRevisions(path,root);
export function auditFileHash(path) {
  const earliest=loadRevisions(root).find(r=>Object.hasOwn(r.beforeFileSha256,path));
  return earliest?.beforeFileSha256[path] ?? createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex');
}
