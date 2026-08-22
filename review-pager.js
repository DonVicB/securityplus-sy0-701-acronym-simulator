(()=>{
  const PAGE_SIZE=5;
  let scheduled=false;
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;paginateResults()});
  }
  function paginateResults(){
    const app=document.getElementById('app');
    if(!app)return;
    const main=app.querySelector('main');
    if(!main||main.dataset.reviewPaged==='1')return;
    const details=[...main.querySelectorAll('details.review-item')];
    if(details.length<=PAGE_SIZE)return;
    main.dataset.reviewPaged='1';
    const source=details.map(d=>d.outerHTML);
    const anchor=document.createElement('div');
    anchor.id='review-page-anchor';
    details[0].before(anchor);
    details.forEach(d=>d.remove());
    const host=document.createElement('div');
    host.id='review-page-host';
    anchor.after(host);
    let page=0;
    const pages=Math.ceil(source.length/PAGE_SIZE);
    function renderPage(){
      const from=page*PAGE_SIZE;
      const to=Math.min(from+PAGE_SIZE,source.length);
      host.innerHTML=`<div class="note"><strong>Answer review:</strong> showing questions ${from+1}–${to} of ${source.length}. Reviews are paged to keep the tablet view fast and stable.</div>${source.slice(from,to).join('')}<div class="btnrow"><button class="btn btn-secondary review-prev" ${page===0?'disabled':''}>← Previous 5</button><span class="pill">Review page ${page+1}/${pages}</span><button class="btn btn-secondary review-next" ${page>=pages-1?'disabled':''}>Next 5 →</button></div>`;
      host.querySelector('.review-prev').onclick=()=>{if(page>0){page--;renderPage();anchor.scrollIntoView({behavior:'smooth',block:'start'})}};
      host.querySelector('.review-next').onclick=()=>{if(page<pages-1){page++;renderPage();anchor.scrollIntoView({behavior:'smooth',block:'start'})}};
    }
    renderPage();
  }
  const app=document.getElementById('app');
  if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
  schedule();
})();
