export const kinds=['house','street','pond','landmark','cluster'];
export const levels=['high','medium','low'];
export function validateProject(value){
  if(!value||!Array.isArray(value.features)||value.features.length>300)throw Error('Expected at most 300 features.');
  const ids=new Set();
  const features=value.features.map((f,i)=>{
    if(!f||!kinds.includes(f.kind)||!levels.includes(f.confidence))throw Error(`Feature ${i+1}: invalid type or confidence.`);
    const id=String(f.id||'').slice(0,30);
    if(!id||ids.has(id))throw Error('Feature IDs must be nonempty and unique.');ids.add(id);
    const points=(p)=>{
      if(!Array.isArray(p)||p.length>150||p.length<(f.kind==='street'?2:f.kind==='landmark'?1:3))throw Error(`${id}: invalid geometry.`);
      return p.map(q=>{if(!Array.isArray(q)||q.length!==2||q.some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0||v>1))throw Error(`${id}: coordinates must be between 0 and 1.`);return q;});
    };
    return {id,kind:f.kind,confidence:f.confidence,basis:String(f.basis||'Manual annotation').slice(0,500),imagePoints:points(f.imagePoints),mapPoints:points(f.mapPoints)};
  });
  return {version:1,features};
}
export function nextId(features,kind){const prefix={house:'H',street:'S',pond:'P',landmark:'L',cluster:'C'}[kind];let i=1;while(features.some(f=>f.id===prefix+String(i).padStart(2,'0')))i++;return prefix+String(i).padStart(2,'0');}
