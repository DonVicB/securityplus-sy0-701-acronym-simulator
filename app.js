let DATA=[];
const DOMAIN_NAMES={1:'General Security Concepts',2:'Threats, Vulnerabilities & Mitigations',3:'Security Architecture',4:'Security Operations',5:'Security Program Management & Oversight'};
const STORAGE='securityplus701-acronym-simulator-v2';
const AREA_INFO={
'Application & Development':'Software, development, APIs, databases, and application security.',
'Cloud & Virtualization':'Cloud service models, virtualization, containers, and hosted infrastructure.',
'Core Security Concepts':'Foundational security principles, controls, models, and terminology.',
'Cryptography & PKI':'Encryption, hashing, digital certificates, keys, signatures, and public key infrastructure.',
'Data Protection & Privacy':'Data classification, privacy, loss prevention, handling, and protection.',
'Emerging Technology':'Newer computing and security technologies that affect risk or architecture.',
'Endpoint & Platform Security':'Endpoint protection, host security, operating systems, and platform controls.',
'General Security & IT':'General computing and security terminology used across multiple objectives.',
'Governance, Risk & Compliance':'Policy, risk, contracts, audits, privacy obligations, and governance.',
'Identity & Access Management':'Authentication, authorization, federation, accounts, and access control.',
'Messaging, Web & Secure Communications':'Web, email, messaging, file transfer, and secure communications.',
'Mobile & Device Management':'Mobile device controls, management, enrollment, and device security.',
'Networking & Network Security':'Protocols, routing, segmentation, wireless, remote access, and network defenses.',
'Operational Technology':'Industrial, embedded, building, and operational technology environments.',
'Physical, Hardware & Platform':'Physical security, hardware security, trusted platforms, and device protections.',
'Resilience & Recovery':'Backups, disaster recovery, continuity, availability, and restoration.',
'Security Monitoring & Response':'Detection, logging, investigation, incident response, and security operations tooling.',
'Threats & Vulnerabilities':'Attacks, weaknesses, malicious techniques, and exploit conditions.',
'Vulnerability Management':'Scanning, assessment, remediation, prioritization, and vulnerability lifecycle management.'
};
let db=loadDB(),view={screen:'home',test:null,index:0};
function fresh(){return {stats:{domains:{},areas:{},terms:{}},history:[]}}
function loadDB(){try{return JSON.parse(localStorage.getItem(STORAGE))||fresh()}catch{return fresh()}}
function saveDB(){localStorage.setItem(STORAGE,JSON.stringify(db))}
function esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function topbar(x=''){return `<div class="topbar"><div class="brand">Security+ SY0-701 Acronym Simulator</div>${x}</div>`}
function bucket(o,k){return o[k]||(o[k]={attempts:0,correct:0,misses:0})}
function pct(s){return s?.attempts?Math.round(100*s.correct/s.attempts):null}
function status(s){const p=pct(s);if(p===null)return ['Not tested','status-none'];if(s.attempts<3)return ['Building data','status-developing'];if(p>=80)return ['Strong','status-strong'];if(p>=60)return ['Developing','status-developing'];return ['Needs practice','status-attention']}
function overall(){let a=0,c=0;Object.values(db.stats.domains||{}).forEach(s=>{a+=s.attempts||0;c+=s.correct||0});return {a,c,p:a?Math.round(100*c/a):null}}
function weakAreas(){return Object.entries(db.stats.areas||{}).map(([name,s])=>({name,...s,p:pct(s)})).filter(x=>x.attempts).sort((a,b)=>(a.p??101)-(b.p??101)||b.misses-a.misses)}
function weakTerms(limit=999){return DATA.map(r=>({r,s:db.stats.terms[r.id]||{attempts:0,correct:0,misses:0}})).map(x=>({...x,p:pct(x.s)})).filter(x=>x.s.attempts&&x.p<80).sort((a,b)=>(a.p??100)-(b.p??100)||b.s.misses-a.s.misses).slice(0,limit)}
function weakPool(){return DATA.map(r=>{const s=db.stats.terms[r.id]||{attempts:0,correct:0,misses:0};return {r,score:(s.attempts?1-s.correct/s.attempts:.45)+(s.misses||0)*.08+(s.attempts?0:.15)}}).sort((a,b)=>b.score-a.score).map(x=>x.r)}
function pool(focus){if(focus==='weak')return weakPool();if(focus.startsWith('d'))return shuffle(DATA.filter(r=>r.domain===+focus.slice(1)));return shuffle(DATA)}
function tokens(text){const stop=new Set(['a','an','and','as','at','by','for','from','in','of','on','or','the','to','with']);return String(text).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter(x=>x&&!stop.has(x))}
function similarity(rec,cand){
 const a=tokens(rec.full),b=tokens(cand.full),sa=new Set(a),sb=new Set(b);let score=0;
 if(cand.area===rec.area)score+=16;if(cand.domain===rec.domain)score+=7;
 score+=[...sa].filter(x=>sb.has(x)).length*5;
 if(a[0]&&a[0]===b[0])score+=3;if(a.at(-1)&&a.at(-1)===b.at(-1))score+=2;
 score+=Math.max(0,3-Math.abs(a.length-b.length));
 score+=Math.max(0,3-Math.floor(Math.abs(rec.full.length-cand.full.length)/12));
 return score+Math.random()*1.25;
}
function distractors(rec,count=4){
 const used=new Set([rec.full]),ranked=DATA.filter(r=>r.id!==rec.id&&r.full!==rec.full).map(r=>({r,s:similarity(rec,r)})).sort((a,b)=>b.s-a.s),out=[];
 for(const x of ranked){if(used.has(x.r.full))continue;used.add(x.r.full);out.push(x.r.full);if(out.length===count)break}return out;
}
function question(rec,i){
 const dup=DATA.filter(x=>x.acronym===rec.acronym).length;
 return {n:i+1,id:rec.id,correct:rec.full,choices:shuffle([rec.full,...distractors(rec,4)]),response:'',flagged:false,context:dup>1?`Context: ${rec.area}. This acronym has multiple valid meanings in the SY0-701 acronym list.`:''};
}
function start(){
 const size=document.getElementById('size').value,focus=document.getElementById('focus').value;let p=pool(focus);const count=size==='all'?p.length:Math.min(+size,p.length);p=p.slice(0,count);
 view.test={id:Date.now(),questions:p.map(question),focus,finished:false,recorded:false};view.index=0;view.screen='test';render();
}
function render(){({home,test,results,dashboard}[view.screen]||home)()}
function home(){
 const o=overall(),w=weakAreas().slice(0,3);
 document.getElementById('app').innerHTML=topbar()+`<main><div class="hero"><div><h1>CompTIA Security+ SY0-701 Acronym Simulator</h1><p class="lead">Challenge mode now focuses on <strong>acronym → full name</strong>. Every question has five dropdown choices, with wrong answers deliberately chosen from closely related Security+ terminology so simple elimination is much harder.</p></div><div class="hero-count"><span class="small">Acronym meanings loaded</span><strong>${DATA.length}</strong><span class="small">SY0-701 objectives list</span></div></div>
 <div class="setup-grid"><div class="setup-card"><label>Test size</label><select id="size"><option value="25">25 questions</option><option value="50" selected>50 questions</option><option value="100">100 questions</option><option value="all">All ${DATA.length}</option></select></div>
 <div class="setup-card"><label>Question focus</label><select id="focus"><option value="all">All acronyms</option><option value="weak">Weak / unmastered areas</option>${[1,2,3,4,5].map(d=>`<option value="d${d}">Domain ${d}: ${DOMAIN_NAMES[d]}</option>`).join('')}</select></div>
 <div class="setup-card"><label>Question style</label><p class="small"><strong>Challenge mode:</strong> acronym → full name only. Five choices. Distractors are prioritised from the same topic/domain and similar wording.</p></div></div>
 <div class="btnrow"><button class="btn btn-primary start">Start acronym challenge</button><button class="btn btn-secondary dash">Weak-area dashboard</button></div>
 ${o.a?`<div class="note"><strong>Learning history:</strong> ${o.c}/${o.a} correct (${o.p}%). ${w.length?`Current weaker topics: ${w.map(x=>esc(x.name)).join(', ')}.`:''}</div>`:`<div class="note"><strong>Fresh start:</strong> learning statistics will build as you complete tests.</div>`}
 <div class="note warn-note"><strong>Difficulty note:</strong> every wrong option is another real Security+ acronym expansion where possible. The goal is recognition, not eliminating obviously unrelated answers.</div>
 <p class="source-note">Original study material based on the CompTIA Security+ SY0-701 objectives acronym list. Not an official CompTIA product and not live exam content.</p></main>`;
 document.querySelector('.start').onclick=start;document.querySelector('.dash').onclick=()=>{view.screen='dashboard';render()};
}
function test(){
 const t=view.test;if(!t){view.screen='home';return render()}const q=t.questions[view.index],r=DATA.find(x=>x.id===q.id),answered=t.questions.filter(x=>x.response).length,flagged=t.questions.filter(x=>x.flagged).length;
 const pal=t.questions.map((x,i)=>`<button class="qnum ${x.response?'answered':''} ${x.flagged?'flagged':''} ${i===view.index?'current':''}" data-i="${i}">${i+1}</button>`).join('');
 document.getElementById('app').innerHTML=topbar(`<div class="topmeta"><span class="pill">${answered}/${t.questions.length} answered</span><button class="btn btn-ghost exit">Exit</button></div>`)+`<main><div class="progress-track"><div class="progress-bar" style="width:${Math.round(100*answered/t.questions.length)}%"></div></div><div class="exam-shell"><section class="question-card">
 <div class="qhead"><div><span class="qtag">Acronym → Full name</span><h2 style="margin-top:10px">Question ${view.index+1}</h2><div class="small">Primary study domain ${r.domain}: ${esc(DOMAIN_NAMES[r.domain])} · ${esc(r.area)}</div></div><button class="btn btn-secondary flag ${q.flagged?'active':''}">${q.flagged?'★ Flagged':'☆ Flag'}</button></div>
 <div class="prompt-box"><div class="prompt-label">What does this acronym stand for?</div><div class="prompt-term">${esc(r.acronym)}</div>${q.context?`<div class="context-hint">${esc(q.context)}</div>`:''}</div>
 <div class="answer-block"><label>Choose the correct full name</label><select id="answer" class="answer-select"><option value="">Select an answer…</option>${q.choices.map(v=>`<option value="${esc(v)}" ${q.response===v?'selected':''}>${esc(v)}</option>`).join('')}</select></div>
 <div class="navbar"><button class="btn btn-secondary prev" ${view.index===0?'disabled':''}>← Previous</button><button class="btn btn-primary next">${view.index===t.questions.length-1?'Finish test':'Next →'}</button></div></section>
 <aside class="sidebar"><strong>Question navigator</strong><div class="statline"><span>Answered</span><b>${answered}/${t.questions.length}</b></div><div class="statline"><span>Flagged</span><b>${flagged}</b></div><div class="palette">${pal}</div><div class="btnrow" style="margin-top:14px"><button class="btn btn-danger finish">Finish test</button></div></aside></div></main>`;
 document.getElementById('answer').onchange=e=>q.response=e.target.value;document.querySelector('.flag').onclick=()=>{q.flagged=!q.flagged;test()};document.querySelector('.prev').onclick=()=>{if(view.index){view.index--;test()}};document.querySelector('.next').onclick=()=>view.index===t.questions.length-1?finish():((view.index++),test());document.querySelector('.finish').onclick=finish;document.querySelector('.exit').onclick=()=>{if(confirm('Exit this test? It will not count toward weak-area statistics until submitted.')){view.screen='home';render()}};document.querySelectorAll('.qnum').forEach(b=>b.onclick=()=>{view.index=+b.dataset.i;test()});
}
function finish(){
 const t=view.test;if(!t||t.finished)return;const unanswered=t.questions.filter(q=>!q.response).length;if(!confirm(unanswered?`Finish with ${unanswered} unanswered question${unanswered===1?'':'s'}?`:'Finish this test and review the answers?'))return;
 t.questions.forEach(q=>q.ok=q.response===q.correct);t.finished=true;if(!t.recorded){record(t);t.recorded=true}view.screen='results';render();
}
function record(t){
 for(const q of t.questions){const r=DATA.find(x=>x.id===q.id);for(const [o,k] of [[db.stats.domains,r.domain],[db.stats.areas,r.area],[db.stats.terms,r.id]]){const s=bucket(o,k);s.attempts++;if(q.ok)s.correct++;else s.misses++}}
 const c=t.questions.filter(q=>q.ok).length;db.history.unshift({date:new Date().toISOString(),size:t.questions.length,correct:c,percent:Math.round(100*c/t.questions.length)});db.history=db.history.slice(0,20);saveDB();
}
function wrong(q){if(!q.response)return 'No answer was selected.';const m=DATA.find(r=>r.full===q.response);return m?`“${q.response}” is the expansion of ${m.acronym}, not the acronym asked in this question.`:'That expansion does not match this acronym.'}
function results(){
 const t=view.test;if(!t?.finished){view.screen='home';return render()}const c=t.questions.filter(q=>q.ok).length,p=Math.round(100*c/t.questions.length),un=t.questions.filter(q=>!q.response).length;
 const rows=[1,2,3,4,5].map(d=>{const qs=t.questions.filter(q=>DATA.find(r=>r.id===q.id).domain===d),cc=qs.filter(q=>q.ok).length;return `<tr><td>${d}. ${DOMAIN_NAMES[d]}</td><td>${qs.length?`${cc}/${qs.length}`:'—'}</td><td>${qs.length?Math.round(100*cc/qs.length)+'%':'Not tested'}</td></tr>`}).join('');
 const a={};t.questions.forEach(q=>{const r=DATA.find(x=>x.id===q.id),x=a[r.area]||(a[r.area]={name:r.area,n:0,c:0});x.n++;if(q.ok)x.c++});const weak=Object.values(a).map(x=>({...x,p:Math.round(100*x.c/x.n)})).sort((x,y)=>x.p-y.p).slice(0,6);
 const review=t.questions.map(q=>{const r=DATA.find(x=>x.id===q.id);return `<details class="review-item"><summary>Q${q.n} · ${esc(r.acronym)} <span class="${q.ok?'goodtext':'dangertext'}">${q.ok?'✓ Correct':'✗ Review'}</span></summary><div class="review-body"><p><strong>Question:</strong> What does ${esc(r.acronym)} stand for?</p><p><strong>Your answer:</strong> ${q.response?esc(q.response):'<span class="dangertext">No answer</span>'}</p><div class="review-correct"><strong>Correct answer:</strong> ${esc(q.correct)}</div>${q.ok?'':`<div class="review-wrong"><strong>Why your answer is incorrect:</strong> ${esc(wrong(q))}</div>`}<div class="explain-box"><h4>What it means</h4><p><strong>${esc(r.acronym)} — ${esc(r.full)}</strong></p><p>${esc(AREA_INFO[r.area]||'Know what this term does, where it is used, and how it differs from nearby Security+ concepts.')}</p></div><div class="explain-box"><h4>Security+ study clue</h4><p>Topic: <strong>${esc(r.area)}</strong>. Compare this acronym with the other real Security+ terms used as distractors; knowing the distinction is more useful than memorising letters alone.</p></div><p class="small">Primary study domain ${r.domain}: ${esc(DOMAIN_NAMES[r.domain])}</p></div></details>`}).join('');
 document.getElementById('app').innerHTML=topbar(`<div class="topmeta"><span class="pill">Results</span><button class="btn btn-ghost home">Home</button></div>`)+`<main><h1>Acronym Challenge Results</h1><div class="results-grid"><div class="metric"><span class="small">Score</span><strong>${p}%</strong><span>${c}/${t.questions.length} correct</span></div><div class="metric"><span class="small">Unanswered</span><strong>${un}</strong><span>counted as incorrect</span></div><div class="metric"><span class="small">Challenge format</span><strong>5 choices</strong><span>closely related distractors</span></div><div class="metric"><span class="small">Completed tests</span><strong>${db.history.length}</strong></div></div><h2>Domain performance</h2><table class="domain-table"><thead><tr><th>Primary study domain</th><th>Correct</th><th>Accuracy</th></tr></thead><tbody>${rows}</tbody></table><h2>Areas needing more practice</h2><div class="weak-grid">${weak.map(x=>`<div class="weak-card"><h3>${esc(x.name)}</h3><strong>${x.p}%</strong><div class="weak-meter"><span style="width:${x.p}%"></span></div><span class="small">${x.c}/${x.n} correct</span></div>`).join('')}</div><div class="btnrow"><button class="btn btn-primary practice">Practice weak areas</button><button class="btn btn-secondary dash">Learning dashboard</button></div><h2 style="margin-top:26px">Review every answer</h2><p class="lead">Open each question to compare the correct expansion with the challenging distractors.</p>${review}</main>`;
 document.querySelector('.home').onclick=()=>{view.screen='home';render()};document.querySelector('.dash').onclick=()=>{view.screen='dashboard';render()};document.querySelector('.practice').onclick=startWeak;
}
function dashboard(){
 const o=overall(),w=weakAreas(),terms=weakTerms(20),cards=[1,2,3,4,5].map(d=>{const s=db.stats.domains[d]||{attempts:0,correct:0,misses:0},p=pct(s),st=status(s);return `<div class="weak-card"><h3>${d}. ${DOMAIN_NAMES[d]}</h3><span class="status-badge ${st[1]}">${st[0]}</span><div style="font-size:2rem;font-weight:800;margin-top:10px">${p===null?'—':p+'%'}</div><div class="small">${s.correct}/${s.attempts} correct</div></div>`}).join('');
 document.getElementById('app').innerHTML=topbar(`<div class="topmeta"><span class="pill">Learning dashboard</span><button class="btn btn-ghost home">Home</button></div>`)+`<main><div class="dashboard-head"><div><h1>Weak Domains & Practice Areas</h1><p class="lead">Statistics persist on this device and update when a challenge is submitted.</p></div>${o.a?'<button class="btn btn-danger reset">Reset statistics</button>':''}</div>${o.a?`<div class="dashboard-summary"><div class="metric"><span class="small">Questions attempted</span><strong>${o.a}</strong></div><div class="metric"><span class="small">Overall accuracy</span><strong>${o.p}%</strong></div><div class="metric"><span class="small">Completed tests</span><strong>${db.history.length}</strong></div><div class="metric"><span class="small">Acronyms below 80%</span><strong>${weakTerms().length}</strong></div></div><h2>Primary study domains</h2><div class="weak-grid">${cards}</div><h2>Weak topic areas</h2><div class="weak-grid">${w.slice(0,10).map(x=>{const st=status(x);return `<div class="weak-card"><h3>${esc(x.name)}</h3><span class="status-badge ${st[1]}">${st[0]}</span><strong style="display:block;font-size:1.6rem;margin-top:8px">${x.p}%</strong><span class="small">${x.correct}/${x.attempts} correct · ${x.misses} misses</span></div>`}).join('')}</div><h2>Individual acronyms to revisit</h2>${terms.length?`<div class="area-list">${terms.map(x=>`<span class="area-chip">${esc(x.r.acronym)} · ${x.p}%</span>`).join('')}</div>`:'<div class="empty">No individual acronym is currently below 80%.</div>'}<div class="btnrow"><button class="btn btn-primary practice">Start weak-area challenge</button></div>`:'<div class="empty"><h3>No completed tests yet</h3><p>Complete a challenge to build domain, topic, and acronym statistics.</p></div>'}</main>`;
 document.querySelector('.home').onclick=()=>{view.screen='home';render()};document.querySelector('.practice')?.addEventListener('click',startWeak);document.querySelector('.reset')?.addEventListener('click',()=>{if(confirm('Reset all stored learning statistics?')){db=fresh();saveDB();dashboard()}});
}
function startWeak(){const p=weakPool().slice(0,Math.min(50,DATA.length));view.test={id:Date.now(),questions:p.map(question),focus:'weak',finished:false,recorded:false};view.index=0;view.screen='test';render()}
(async()=>{try{DATA=await window.loadAcronymData();render()}catch(e){document.getElementById('app').innerHTML=topbar()+`<main><h1>Security+ SY0-701 Acronym Simulator</h1><p class="dangertext"><strong>Unable to load the acronym bank.</strong></p><p>${esc(e.message)}</p></main>`}})();