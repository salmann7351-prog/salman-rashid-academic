document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  loadPage();
});

const icons = {
  chart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V10M10 19V5M16 19v-7M22 19V3"/></svg>',
  chip:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  globe:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>',
  ship:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16h16l-2 3H6zM8 16V7h8v9M10 7V4h4v3M3 20c2 1 3 1 5 0 2 1 3 1 5 0 2 1 3 1 5 0"/></svg>',
  cv:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  research:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4-4z"/><path d="M9 20V8"/></svg>',
  rec:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.1 6.4L21 12l-6.9 2.6L12 21l-2.1-6.4L3 12l6.9-2.6z"/></svg>',
  contact:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>'
};
const esc=(s='')=>String(s).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[m]));
const linkArrow=(txt,href,cls='text-link')=>`<a class="${cls}" href="${href}">${esc(txt)} <span class="arrow">→</span></a>`;

async function getContent(){
  const r=await fetch('data/site-content.json',{cache:'no-store'});
  if(!r.ok) throw new Error('Unable to load site content');
  return r.json();
}
function renderProjectCards(projects){
  return projects.map(p=>`<article class="project-card">
      <div class="project-top"><span class="project-no">${esc(p.number)}</span><span class="status ${p.statusClass||''}">${esc(p.status)}</span></div>
      <div class="project-kicker">${esc(p.kicker)}</div>
      <h3>${esc(p.shortTitle||p.title)}</h3>
      <div class="project-meta">${esc(p.meta)}</div>
      <p>${esc(p.summary)}</p>
      <div class="tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
      ${linkArrow('View project',p.page)}
    </article>`).join('');
}
function renderInterests(interests){
  return interests.map(i=>`<article class="interest-card">
    <div class="icon">${icons[i.icon]||''}</div><h3>${esc(i.title)}</h3><p>${esc(i.description)}</p>
  </article>`).join('');
}
function recommendationView(items){
  if(!items?.length) return `<div class="empty-recs"><p>No recommendations have been published yet.</p><a class="button button-outline" href="recommendations.html">Request or submit a recommendation</a></div>`;
  return `<div class="recommendation-grid">${items.map(x=>`<article class="recommendation-card"><p class="quote">“${esc(x.text)}”</p><div class="rec-name">${esc(x.name)}</div><div class="rec-role">${esc(x.role||'')}</div><div class="rec-affil">${esc(x.affiliation||'')}</div></article>`).join('')}</div>`;
}

async function loadPage(){
  const page=document.body.dataset.page;
  if(!page) return;
  try{ const c=await getContent(); if(page==='home') renderHome(c); if(page==='research') renderResearch(c); if(page==='cv') renderCV(c); if(page==='recommendations') renderRecommendations(c); if(page==='project') renderProject(c); }catch(e){ const el=document.querySelector('[data-loading]'); if(el){el.textContent='Content could not be loaded. Please refresh the page.';} console.error(e); }
}
function renderHome(c){
  q('#hero-kicker').textContent=c.profile.kicker; q('#hero-name').innerHTML=`Salman <em>Rashid</em>`; q('#hero-role').textContent='Economist & Policy Researcher'; q('#hero-location').textContent=c.profile.location;
  q('#positioning-body').innerHTML=c.profile.positioning.map(x=>`<p>${esc(x)}</p>`).join(''); q('#open-to').textContent=c.profile.openTo;
  q('#eag-title').textContent=c.eag.title; q('#eag-date').textContent=c.eag.date; q('#eag-summary').textContent=c.eag.summary; q('#eag-brief').textContent=c.eag.firstBrief; q('#eag-work').textContent=c.eag.work;
  q('#research-grid').innerHTML=renderProjectCards(c.researchProjects); q('#interest-grid').innerHTML=renderInterests(c.researchInterests); q('#recommendation-block').innerHTML=recommendationView(c.recommendations.items);
  q('#footer-name').textContent=c.profile.name; q('#footer-role').textContent='ECONOMIST & POLICY RESEARCHER'; q('#contact-email').href=`mailto:${c.contact.email}`; q('#contact-email').textContent=c.contact.email; q('#contact-linkedin').href=c.contact.linkedin;
}
function renderResearch(c){
  q('#research-intro').textContent='My work asks how monetary policy actually reaches the real economy in Pakistan, and how the institutions that set policy explain their own reasoning. The three projects below approach that question from related angles: aggregate transmission, central bank communication, and industry-level heterogeneity.';
  q('#research-project-list').innerHTML=c.researchProjects.map((p)=>`<article class="research-row"><div class="row-top"><span class="project-no">${esc(p.number)}</span><span class="status ${p.statusClass||''}">${esc(p.status)}</span></div><div><div class="project-kicker">${esc(p.kicker)}</div><h2>${esc(p.title)}</h2><div class="project-meta">${esc(p.meta)}</div><p>${esc(p.summary)}</p><div class="tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>${linkArrow('Read the full research page',p.page)}</div></article>`).join('');
  q('#research-interest-list').innerHTML=renderInterests(c.researchInterests);
}
function renderCV(c){
  q('#cv-summary').textContent=c.cv.summary;
  const renderEntries=arr=>arr.map(e=>`<div class="cv-entry"><h3>${esc(e.title)}</h3><div class="cv-meta">${esc(e.date)}</div><ul>${e.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div>`).join('');
  q('#cv-research-experience').innerHTML=renderEntries(c.cv.experience);
  q('#cv-additional').innerHTML=renderEntries(c.cv.additionalExperience);
  q('#cv-education').innerHTML=c.cv.education.map(e=>`<div class="cv-entry"><h3>${esc(e.title)}</h3><div class="cv-meta">${esc(e.date)}</div>${e.detail?`<p>${esc(e.detail)}</p>`:''}</div>`).join('');
  q('#cv-outputs').innerHTML=c.cv.outputs.map(e=>`<div class="cv-entry"><h3>${esc(e.title)}</h3><div class="cv-meta">${esc(e.meta)}</div></div>`).join('');
  q('#cv-certs').innerHTML=c.cv.certifications.map(x=>`<li>${esc(x)}</li>`).join('');
  q('#cv-honours').innerHTML=c.cv.honours.map(x=>`<li>${esc(x)}</li>`).join('');
  q('#cv-skills').innerHTML=Object.entries(c.cv.skills).map(([k,v])=>`<div><h4>${esc(k)}</h4><p>${esc(v)}</p></div>`).join(''); q('#cv-languages').textContent=c.cv.languages;
}
function renderRecommendations(c){
  const box=q('#recommendation-public'); box.innerHTML=recommendationView(c.recommendations.items);
  const form=q('#recommendation-form'); const closed=q('#recommendation-closed');
  if(c.recommendations.allowSubmissions){ form.hidden=false; closed.hidden=true; } else { form.hidden=true; closed.hidden=false; }
  form?.addEventListener('submit',async e=>{ e.preventDefault(); const fd=new FormData(form); const out=q('#rec-form-message'); out.textContent='Submitting…'; out.className='form-message';
    try{ const resp=await fetch('/api/recommendation-submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:fd.get('name'),email:fd.get('email'),affiliation:fd.get('affiliation'),role:fd.get('role'),text:fd.get('text'),consent:fd.get('consent')==='on',website:fd.get('website')||'',startedAt:fd.get('startedAt')||Date.now()})}); const data=await resp.json(); if(!resp.ok) throw new Error(data.error||'Unable to submit'); out.textContent=data.message; out.className='form-message success'; form.reset(); }catch(err){out.textContent=err.message; out.className='form-message error';}
  });
}
function renderDetailFromFields(p){
  const d=p.detail||{}; const parts=[];
  if(d.overview) parts.push(`<section><h2>Overview</h2><p>${esc(d.overview)}</p></section>`);
  if(d.question) parts.push(`<section><h2>Research question</h2><p>${esc(d.question)}</p></section>`);
  if(d.methods) parts.push(`<section><h2>Methodology / research design</h2><p>${esc(d.methods)}</p></section>`);
  if(d.contribution) parts.push(`<section><h2>Contribution</h2><p>${esc(d.contribution)}</p></section>`);
  if(d.statusNote) parts.push(`<section><h2>Current status</h2><p>${esc(d.statusNote)}</p></section>`);
  if(!parts.length) parts.push(`<section><h2>Project overview</h2><p>${esc(p.summary||'Research details will be added as the project develops.')}</p></section>`);
  return parts.join('');
}
function renderDetailFromFields(p){
  const d=p.detail||{}; const parts=[];
  if(d.overview) parts.push(`<section><h2>Overview</h2><p>${esc(d.overview)}</p></section>`);
  if(d.question) parts.push(`<section><h2>Research question</h2><p>${esc(d.question)}</p></section>`);
  if(d.methods) parts.push(`<section><h2>Methodology / research design</h2><p>${esc(d.methods)}</p></section>`);
  if(d.contribution) parts.push(`<section><h2>Contribution</h2><p>${esc(d.contribution)}</p></section>`);
  if(d.statusNote) parts.push(`<section><h2>Current status</h2><p>${esc(d.statusNote)}</p></section>`);
  if(!parts.length) parts.push(`<section><h2>Project overview</h2><p>${esc(p.summary||'Research details will be added as the project develops.')}</p></section>`);
  return parts.join('');
}
async function renderProject(c){
  const slug=new URLSearchParams(location.search).get('slug')||''; const p=c.researchProjects.find(x=>x.id===slug);
  if(!p){ q('#project-shell').innerHTML='<main class="wrap content"><p>Research project not found.</p></main>'; return; }
  q('#project-status').textContent=`${p.kicker} · ${p.status}`; q('#project-title').textContent=p.title; q('#project-meta').textContent=p.meta;
  q('#project-body').innerHTML=p.detailHtml||renderDetailFromFields(p);
}
function q(s){return document.querySelector(s)}
