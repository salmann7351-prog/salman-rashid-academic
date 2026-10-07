const ownerRepo=()=>process.env.GITHUB_REPO; const branch=()=>process.env.GITHUB_BRANCH||'main'; const token=()=>process.env.GITHUB_TOKEN;
async function gh(path,opts={}){const r=await fetch(`https://api.github.com/repos/${ownerRepo()}/contents/${path}`,{...opts,headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token()}`,'X-GitHub-Api-Version':'2022-11-28',...(opts.headers||{})}}); const data=await r.json(); if(!r.ok) throw new Error(data.message||`GitHub request failed (${r.status})`); return data}
async function getFile(path){return gh(`${path}?ref=${encodeURIComponent(branch())}`,{method:'GET'})}
async function putFile(path,content,message,sha){const body={message,content,branch:branch()}; if(sha)body.sha=sha; return gh(path,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}
async function readJson(path){const d=await getFile(path); const raw=Buffer.from(d.content.replace(/\n/g,''),'base64').toString('utf8'); return {data:JSON.parse(raw),sha:d.sha}}
async function writeJson(path,data,message){let sha; try{sha=(await getFile(path)).sha}catch(e){} const b64=Buffer.from(JSON.stringify(data,null,2)+'\n').toString('base64'); return putFile(path,b64,message,sha)}
module.exports={getFile,putFile,readJson,writeJson,branch};
