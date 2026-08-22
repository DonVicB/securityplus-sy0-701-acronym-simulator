async function startAcronymApp(){
  if(!('DecompressionStream' in window)) throw new Error('Please update Chrome or Samsung Internet to run the simulator.');
  const src=window.APP10_PARTS||[];
  if(src.length<7||src.slice(0,7).some(p=>typeof p!=='string')) throw new Error(`Build 10 payload incomplete: expected 7 chunks, found ${src.filter(p=>typeof p==='string').length}.`);
  const clean=s=>String(s).replace(/[^A-Za-z0-9+/=]/g,'');
  function checksum(s){let sum=0,weighted=0;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);sum+=c;weighted+=(i+1)*c}return [sum,weighted]}
  function repairFirst(s){
    s=clean(s);
    const EXPECT_LEN=6800, EXPECT_SUM=585920, EXPECT_WEIGHTED=1994577542;
    let [sum,weighted]=checksum(s);
    if(s.length===EXPECT_LEN&&sum===EXPECT_SUM&&weighted===EXPECT_WEIGHTED)return s;
    if(s.length===EXPECT_LEN+1){
      const suffix=new Array(s.length+1).fill(0);
      for(let i=s.length-1;i>=0;i--)suffix[i]=suffix[i+1]+s.charCodeAt(i);
      for(let k=0;k<s.length;k++){
        const c=s.charCodeAt(k);
        const candidateSum=sum-c;
        const candidateWeighted=weighted-(k+1)*c-suffix[k+1];
        if(candidateSum===EXPECT_SUM&&candidateWeighted===EXPECT_WEIGHTED)return s.slice(0,k)+s.slice(k+1);
      }
    }
    throw new Error(`Build 10 payload chunk 1 failed validation (length ${s.length}, checksum ${sum}/${weighted}).`);
  }
  const parts=[repairFirst(src[0]),...src.slice(1,7).map(clean)];
  const expected=[6800,6800,6800,6800,6800,6800,1568];
  parts.forEach((p,i)=>{if(p.length!==expected[i])throw new Error(`Build 10 payload chunk ${i+1} has length ${p.length}; expected ${expected[i]}.`)});
  const b64=parts.join('');
  if(b64.length!==42368)throw new Error(`Build 10 payload length ${b64.length}; expected 42368.`);
  const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  const code=await new Response(stream).text();
  const url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));
  try{await import(url)}finally{URL.revokeObjectURL(url)}
}
startAcronymApp().catch(err=>{
  const app=document.getElementById('app');
  if(app)app.innerHTML=`<main><h1>Security+ SY0-701 Acronym Simulator</h1><p class="dangertext"><strong>Startup error</strong></p><p>${String(err.message||err).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</p></main>`;
  setTimeout(()=>{throw err},0);
});
