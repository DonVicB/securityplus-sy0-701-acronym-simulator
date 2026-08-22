async function startAcronymApp(){
  if(!('DecompressionStream' in window)) throw new Error('Please update Chrome or Samsung Internet to run the simulator.');
  const b64=(window.APP8_PARTS||[]).join('');
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
