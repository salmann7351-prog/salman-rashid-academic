const crypto = require('crypto');
function secret(){return process.env.ADMIN_SESSION_SECRET || ""}
function sign(payload){return crypto.createHmac('sha256',secret()).update(payload).digest('hex')}
function makeSession(){const exp=Date.now()+1000*60*60*8; const p=String(exp); return p+'.'+sign(p)}
function verifySession(req){const h=req.headers.cookie||''; const m=h.match(/(?:^|; )admin_session=([^;]+)/); if(!m||!secret())return false; const [p,s]=m[1].split('.'); if(!p||!s||Number(p)<Date.now())return false; return crypto.timingSafeEqual(Buffer.from(s),Buffer.from(sign(p)))}
function cookie(value,maxAge){return `admin_session=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`}
module.exports={makeSession,verifySession,cookie};
