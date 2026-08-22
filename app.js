let DATA=[];
const D={1:'General Security Concepts',2:'Threats, Vulnerabilities & Mitigations',3:'Security Architecture',4:'Security Operations',5:'Security Program Management & Oversight'};
const KEY='secplus701-acronyms-v1';
const AREA_INFO={
'Application & Development':'Software, development, code, web applications, APIs, databases, and application security.',
'Cloud & Virtualization':'Cloud service models, virtualization, containers, and hosted infrastructure.',
'Core Security Concepts':'Foundational security principles, controls, models, and terminology.',
'Cryptography & PKI':'Encryption, hashing, digital certificates, keys, signatures, and public key infrastructure.',
'Data Protection & Privacy':'Data classification, privacy, loss prevention, handling, and protection.',
'Emerging Technology':'Newer computing and security technologies that may affect risk or architecture.',
'Endpoint & Platform Security':'Endpoint protection, host security, operating systems, and platform controls.',
'General Security & IT':'General computing or security terminology used across multiple objective areas.',
'Governance, Risk & Compliance':'Policy, risk, contracts, audits, privacy obligations, and organizational governance.',
'Identity & Access Management':'Authentication, authorization, federation, account management, and access control.',
'Messaging, Web & Secure Communications':'Web, email, messaging, file transfer, and secure communication technologies.',
'Mobile & Device Management':'Mobile device controls, management, enrollment, and device security.',
'Networking & Network Security':'Network protocols, addressing, routing, segmentation, wireless, remote access, and network defenses.',
'Operational Technology':'Industrial, embedded, building, and operational technology environments.',
'Physical, Hardware & Platform':'Physical security, hardware security, trusted platforms, and device-level protections.',
'Resilience & Recovery':'Backups, disaster recovery, continuity, availability, and restoration.',
'Security Monitoring & Response':'Detection, logging, investigation, incident response, and security operations tooling.',
'Threats & Vulnerabilities':'Attacks, weaknesses, malicious techniques, and exploit conditions.',
'Vulnerability Management':'Scanning, assessment, remediation, prioritization, and vulnerability lifecycle management.'
};
let db=load(),view={screen:'home',test:null,index:0};
function fresh(){return {stats:{domains:{},areas:{},terms:{}},history:[]}}
function load(){try{let x=JSON.parse(localStorage.getItem(KEY));return x||fresh()}catch{return fresh()}}
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function esc(s){return String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
function sh(a){a=[...a];for(let i=a.length-1;i;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function top(x=''){return `<div class="topbar"><div class="brand">Security+ SY0-701 Acronym Simulator</div>${x}</div>`}
function bucket(o,k){return o[k]||(o[k]={attempts:0,correct:0,misses:0})}
function percent(s){return s?.attempts?Math.round(100*s.correct/s.attempts):null}
function status(s){let p=percent(s);if(p===null)return ['Not tested','status-none'];if(s.attempts<3)return ['Building data','status-developing'];if(p>=80)return ['Strong','status-strong'];if(p>=60)return ['Developing','status-developing'];return ['Needs practice','status-attention']}
function overall(){let a=0,c=0;Object.values(db.stats.domains).forEach(s=>{a+=s.attempts||0;c+=s.correct||0});return {a,c,p:a?Math.round(100*c/a):null}}
function weakRows(){return Object.entries(db.stats.areas).map(([name,s])=>({name,...s,p:percent(s)})).filter(x=>x.attempts).sort((a,b)=>a.p-b.p||b.misses-a.misses)}
function weakTerms(limit=999){return DATA.map(r=>({r,s:db.stats.terms[r.id]||{attempts:0,correct:0,misses:0}})).map(x=>({...x,p:percent(x.s)})).filter(x=>x.s.attempts&&x.p<80).sort((a,b)=>a.p-b.p||b.s.misses-a.s.misses).slice(0,limit)}
function pool(focus){
 if(focus==='weak')return DATA.map(r=>{let s=db.stats.terms[r.id]||{attempts:0,correct:0,misses:0};return {r,score:(s.attempts?1-s.correct/s.attempts:.55)+(s.misses||0)*.08}}).sort((a,b)=>b.score-a.score).map(x=>x.r);
 if(focus.startsWith('d'))return sh(DATA.filter(r=>r.domain===+focus.slice(1)));
 return sh(DATA)
}
function distract(rec,dir){
 let same=sh(DATA.filter(r=>r.id!==rec.id&&r.area===rec.area)),rest=sh(DATA.filter(r=>r.id!==rec.id&&r.area!==rec.area)),out=[],correct=dir==='a2f'?rec.full:rec.acronym;
 for(const r of [...same,...rest]){let v=dir==='a2f'?r.full:r.acronym;if(v!==correct&&!out.includes(v))out.push(v);if(out.length===3)break}return out
}
function question(rec,i,offset){
 let dir=(i+offset)%2?'f2a':'a2f',correct=dir==='a2f'?rec.full:rec.acronym,dups=DATA.filter(x=>x.acronym===rec.acronym).length;
 return {n:i+1,id:rec.id,dir,correct,choices:sh([correct,...distract(rec,dir)]),response:'',context:dir==='a2f'&&dups>1?`Context: ${rec.area}. This acronym has more than one valid expansion in the objectives list.`:''}
}
function start(){
 let size=document.getElementById('size').value,focus=document.getElementById('focus').value,p=pool(focus),count=size==='all'?p.length:Math.min(+size,p.length),offset=Math.random()<.5?0:1;
 p=p.slice(0,count);view.test={id:Date.now(),questions:p.map((r,i)=>question(r,i,offset)),finished:false,recorded:false};view.index=0;view.screen='test';render()
}
function render(){({home, test, results, dashboard}[view.screen]||home)()}
function home(){
 let o=overall(),w=weakRows().slice(0,3);
 document.getElementById('app').innerHTML=top()+`<main><div class="hero"><div><h1>CompTIA Security+ SY0-701 Acronym Simulator</h1><p class="lead">Mixed <strong>acronym → full name</strong> and <strong>full name → acronym</strong> practice. Every question uses a dropdown. Results include detailed explanations and persistent weak-domain, weak-topic, and individual-acronym tracking.</p></div><div class="hero-count"><span class="small">Acronym meanings loaded</span><strong>${DATA.length}</strong><span class="small">SY0-701 objectives list</span></div></div>
 <div class="setup-grid"><div class="setup-card"><label>Test size</label><select id="size"><option value="25">25 questions</option><option value="50" selected>50 questions</option><option value="100">100 questions</option><option value="all">All ${DATA.length}</option></select></div>
 <div class="setup-card"><label>Question focus</label><select id="focus"><option value="all">All acronyms</option><option value="weak">Weak / unmastered areas</option>${[1,2,3,4,5].map(d=>`<option value="d${d}">Domain ${d}: ${D[d]}</option>`).join('')}</select></div>
 <div class="setup-card"><label>Question style</label><p class="small">Automatically balanced between both directions with four dropdown choices.</p></div></div>
 <div class="btnrow"><button class="btn btn-primary start">Start mixed acronym test</button><button class="btn btn-secondary dash">Weak-area dashboard</button></div>
 ${o.a?`<div class="note"><strong>Learning history:</strong> ${o.c}/${o.a} correct (${o.p}%). ${w.length?`Current weaker topics: ${w.map(x=>esc(x.name)).join(', ')}.`:''}</div>`:`<div class="note"><strong>Fresh start:</strong> learning statistics will build as you complete tests.</div>`}
 <div class="note warn-note"><strong>Domain note:</strong> CompTIA publishes the acronym list but does not map every acronym to one domain. This trainer assigns a primary study domain and topic area for useful progress tracking.</div>
 <p class="source-note">Original study material based on the Security+ SY0-701 objectives acronym list. Not an official CompTIA product and not live exam content.</p></main>`;
 document.querySelector('.start').onclick=start;document.querySelector('.dash').onclick=()=>{view.screen='dashboard';render()}
}
function test(){
 let t=view.test;if(!t)return goHome();let q=t.questions[view.index],r=DATA.find(x=>x.id===q.id),answered=t.questions.filter(x=>x.response).length;
 let pal=t.questions.map((x,i)=>`<button class="qnum ${x.response?'answered':''} ${i===view.index?'current':''}" data-i="${i}">${i+1}</button>`).join('');
 document.getElementById('app').innerHTML=top(`<div class="topmeta"><span class="pill">${answered}/${t.questions.length} answered</span><button class="btn btn-ghost exit">Exit</button></div>`)+`<main><div class="progress-track"><div class="progress-bar" style="width:${Math.round(100*answered/t.questions.length)}%"></div></div><div class="exam-shell"><section class="question-card">
 <div class="qhead"><div><span class="qtag">${q.dir==='a2f'?'Acronym → Full name':'Full name → Acronym'}</span><h2 style="margin-top:10px">Question ${view.index+1}</h2><div class="small">Primary study domain ${r.domain}: ${esc(D[r.domain])} · ${esc(r.area)}</div></div></div>
 <div class="prompt-box"><div class="prompt-label">${q.dir==='a2f'?'What does this acronym stand for?':'Which acronym matches this full term?'}</div><div class="prompt-term">${esc(q.dir==='a2f'?r.acronym:r.full)}</div>${q.context?`<div class="context-hint">${esc(q.context)}</div>`:''}</div>
 <div class="answer-block"><label>Choose one answer</label><select id="answer" class="answer-select"><option value="">Select an answer…</option>${q.choices.map(v=>`<option value="${esc(v)}" ${q.response===v?'selected':''}>${esc(v)}</option>`).join('')}</select></div>
 <div class="navbar"><button class="btn btn-secondary prev" ${view.index===0?'disabled':''}>← Previous</button><button class="btn btn-primary next">${view.index===t.questions.length-1?'Finish test':'Next →'}</button></div></section>
 <aside class="sidebar"><strong>Question navigator</strong><div class="statline"><span>Answered</span><b>${answered}/${t.questions.length}</b></div><div class="palette">${pal}</div><div class="btnrow" style="margin-top:14px"><button class="btn btn-danger finish">Finish test</button></div></aside></div></main>`;
 document.getElementById('answer').onchange=e=>{q.response=e.target.value};
 document.querySelector('.prev').onclick=()=>{if(view.index){view.index--;test()}};
 document.querySelector('.next').onclick=()=>{if(view.index===t.questions.length-1)finish();else{view.index++;test()}};
 document.querySelector('.finish').onclick=finish;document.querySelector('.exit').onclick=goHome;
 document.querySelectorAll('.qnum').forEach(b=>b.onclick=()=>{view.index=+b.dataset.i;test()})
}
function finish(){
 let t=view.test;if(!t||t.finished)return;if(!confirm('Finish this test and review the answers?'))return;
 t.questions.forEach(q=>q.ok=q.response===q.correct);t.finished=true;if(!t.recorded){record(t);t.recorded=true}view.screen='results';render()
}
function record(t){
 for(const q of t.questions){let r=DATA.find(x=>x.id===q.id);for(const [o,k] of [[db.stats.domains,r.domain],[db.stats.areas,r.area],[db.stats.terms,r.id]]){let s=bucket(o,k);s.attempts++;if(q.ok)s.correct++;else s.misses++}}
 let c=t.questions.filter(q=>q.ok).length;db.history.unshift({date:new Date().toISOString(),size:t.questions.length,correct:c,percent:Math.round(100*c/t.questions.length)});db.history=db.history.slice(0,20);save()
}
function whyWrong(q){
 if(!q.response)return 'No answer was selected.';
 if(q.dir==='a2f'){let m=DATA.find(r=>r.full===q.response);return m?`“${q.response}” is the expansion of ${m.acronym}, not the acronym asked here.`:'That expansion does not match the acronym asked here.'}
 let m=DATA.filter(r=>r.acronym===q.response);return m.length?`${q.response} is used for ${m.map(x=>x.full).join(' / ')}, not the full term asked here.`:'That acronym does not match the full term asked here.'
}
function results(){
 let t=view.test;if(!t?.finished){view.screen='home';return render()}let c=t.questions.filter(q=>q.ok).length,p=Math.round(100*c/t.questions.length),un=t.questions.filter(q=>!q.response).length;
 let dr=[1,2,3,4,5].map(d=>{let qs=t.questions.filter(q=>DATA.find(r=>r.id===q.id).domain===d),cc=qs.filter(q=>q.ok).length;return `<tr><td>${d}. ${D[d]}</td><td>${qs.length?`${cc}/${qs.length}`:'—'}</td><td>${qs.length?Math.round(100*cc/qs.length)+'%':'Not tested'}</td></tr>`}).join('');
 let a={};t.questions.forEach(q=>{let r=DATA.find(x=>x.id===q.id),x=a[r.area]||(a[r.area]={n:r.area,a:0,c:0});x.a++;if(q.ok)x.c++});let weak=Object.values(a).map(x=>({...x,p:Math.round(100*x.c/x.a)})).sort((x,y)=>x.p-y.p).slice(0,6);
 let review=t.questions.map(q=>{let r=DATA.find(x=>x.id===q.id);return `<details class="review-item"><summary>Q${q.n} · ${esc(q.dir==='a2f'?r.acronym:r.full)} <span class="${q.ok?'goodtext':'dangertext'}">${q.ok?'✓ Correct':'✗ Review'}</span></summary><div class="review-body"><p><strong>Your answer:</strong> ${q.response?esc(q.response):'<span class="dangertext">No answer</span>'}</p><div class="review-correct"><strong>Correct answer:</strong> ${esc(q.correct)}</div>${q.ok?'':`<div class="review-wrong"><strong>Why your answer is incorrect:</strong> ${esc(whyWrong(q))}</div>`}<div class="explain-box"><h4>What it means</h4><p><strong>${esc(r.acronym)} — ${esc(r.full)}</strong></p><p>${esc(AREA_INFO[r.area]||'Know the term, its purpose, and where it is used in a security scenario.')}</p></div><div class="explain-box"><h4>Security+ study clue</h4><p>Topic: <strong>${esc(r.area)}</strong>. Focus on identifying the function or security problem the term addresses, rather than matching a single keyword.</p></div><p class="small">Primary study domain ${r.domain}: ${esc(D[r.domain])}</p></div></details>`}).join('');
 document.getElementById('app').innerHTML=top(`<div class="topmeta"><span class="pill">Results</span><button class="btn btn-ghost home">Home</button></div>`)+`<main><h1>Acronym Test Results</h1><div class="results-grid"><div class="metric"><span class="small">Score</span><strong>${p}%</strong><span>${c}/${t.questions.length} correct</span></div><div class="metric"><span class="small">Unanswered</span><strong>${un}</strong><span>counted as incorrect</span></div><div class="metric"><span class="small">Question mix</span><strong>${t.questions.filter(q=>q.dir==='a2f').length}/${t.questions.filter(q=>q.dir==='f2a').length}</strong><span>acronym→name / name→acronym</span></div><div class="metric"><span class="small">Completed tests</span><strong>${db.history.length}</strong></div></div>
 <h2>Domain performance</h2><table class="domain-table"><thead><tr><th>Primary study domain</th><th>Correct</th><th>Accuracy</th></tr></thead><tbody>${dr}</tbody></table>
 <h2>Areas needing more practice</h2><div class="weak-grid">${weak.map(x=>`<div class="weak-card"><h3>${esc(x.n)}</h3><strong>${x.p}%</strong><div class="weak-meter"><span style="width:${x.p}%"></span></div><span class="small">${x.c}/${x.a} correct in this test</span></div>`).join('')}</div>
 <div class="btnrow"><button class="btn btn-primary practice">Practice weak areas</button><button class="btn btn-secondary dash">Learning dashboard</button></div><h2 style="margin-top:26px">Review every answer</h2><p class="lead">Open a question for the correct answer, why a wrong selection was wrong, and useful Security+ context.</p>${review}</main>`;
 document.querySelector('.home').onclick=goHome;document.querySelector('.dash').onclick=()=>{view.screen='dashboard';render()};document.querySelector('.practice').onclick=startWeak
}
function dashboard(){
 let o=overall(),w=weakRows(),terms=weakTerms(20),cards=[1,2,3,4,5].map(d=>{let s=db.stats.domains[d]||{attempts:0,correct:0,misses:0},p=percent(s),st=status(s);return `<div class="weak-card"><h3>${d}. ${D[d]}</h3><span class="status-badge ${st[1]}">${st[0]}</span><div style="font-size:2rem;font-weight:800;margin-top:10px">${p===null?'—':p+'%'}</div><div class="small">${s.correct}/${s.attempts} correct</div></div>`}).join('');
 document.getElementById('app').innerHTML=top(`<div class="topmeta"><span class="pill">Learning dashboard</span><button class="btn btn-ghost home">Home</button></div>`)+`<main><div class="dashboard-head"><div><h1>Weak Domains & Practice Areas</h1><p class="lead">Statistics persist on this device and update when a test is submitted.</p></div>${o.a?'<button class="btn btn-danger reset">Reset statistics</button>':''}</div>${o.a?`<div class="dashboard-summary"><div class="metric"><span class="small">Questions attempted</span><strong>${o.a}</strong></div><div class="metric"><span class="small">Overall accuracy</span><strong>${o.p}%</strong></div><div class="metric"><span class="small">Completed tests</span><strong>${db.history.length}</strong></div><div class="metric"><span class="small">Acronyms below 80%</span><strong>${weakTerms().length}</strong></div></div><h2>Primary study domains</h2><div class="weak-grid">${cards}</div><h2>Weak topic areas</h2><div class="weak-grid">${w.slice(0,10).map(x=>{let st=status(x);return `<div class="weak-card"><h3>${esc(x.name)}</h3><span class="status-badge ${st[1]}">${st[0]}</span><strong style="display:block;font-size:1.6rem;margin-top:8px">${x.p}%</strong><span class="small">${x.correct}/${x.attempts} correct · ${x.misses} misses</span></div>`}).join('')}</div><h2>Individual acronyms to revisit</h2>${terms.length?`<div class="area-list">${terms.map(x=>`<span class="area-chip">${esc(x.r.acronym)} · ${x.p}%</span>`).join('')}</div>`:'<div class="empty">No individual acronym is currently below 80%.</div>'}<div class="btnrow"><button class="btn btn-primary practice">Start weak-area test</button></div>`:'<div class="empty"><h3>No completed tests yet</h3><p>Complete a test to build domain, topic, and acronym statistics.</p></div>'}</main>`;
 document.querySelector('.home').onclick=goHome;document.querySelector('.practice')?.addEventListener('click',startWeak);document.querySelector('.reset')?.addEventListener('click',()=>{if(confirm('Reset all stored learning statistics?')){db=fresh();save();dashboard()}})
}
function startWeak(){let p=pool('weak').slice(0,Math.min(50,DATA.length)),offset=Math.random()<.5?0:1;view.test={id:Date.now(),questions:p.map((r,i)=>question(r,i,offset)),finished:false,recorded:false};view.index=0;view.screen='test';render()}
function goHome(){view.screen='home';render()}
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
(async()=>{try{DATA=await window.loadAcronymData();render()}catch(e){document.getElementById('app').innerHTML=top()+`<main><h1>Security+ SY0-701 Acronym Simulator</h1><p class="dangertext"><strong>Unable to load the acronym bank.</strong></p><p>${esc(e.message)}</p></main>`}})();
