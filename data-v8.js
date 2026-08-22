window.loadAcronymData=async function(){
  if(!('DecompressionStream' in window)) throw new Error('Please update Chrome or Samsung Internet to load the offline acronym bank.');
  const b64=(window.DATA8_PARTS||[]).join('');
  const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(stream).text());
};
