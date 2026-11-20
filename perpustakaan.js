// Perpustakaan Digital — katalog dinamis dari Supabase, dengan katalog lama sebagai fallback
(() => {
  'use strict';
  const fallbackCatalog = [
    {title:'Karya JUARA',author_name:'ADLEY THEONATHAN',flipbook_url:'https://heyzine.com/flip-book/9a8153b15c.html'},
    {title:'Karya JUARA',author_name:'ADZKIYA CARISSA FITRI',flipbook_url:'https://heyzine.com/flip-book/91db5eaf00.html'},
    {title:'Karya JUARA',author_name:'ANGELIA AMARA VELOVA',flipbook_url:'https://heyzine.com/flip-book/6dced6f3ed.html#page/2'},
    {title:'Karya JUARA',author_name:'BRINTINO ROGAS',flipbook_url:'https://heyzine.com/flip-book/db28139ca0.html'},
    {title:'Karya JUARA',author_name:'CHERYL QUEENA PIKASO',flipbook_url:'https://heyzine.com/flip-book/52e3c263b3.html'},
    {title:'Karya JUARA',author_name:'CLAUDIA OKTIA',flipbook_url:'https://heyzine.com/flip-book/2ca0e0319a.html'},
    {title:'Karya JUARA',author_name:'DHEA WIMAHAR PANDEHEN',flipbook_url:'https://heyzine.com/flip-book/4c91a62377.html'},
    {title:'Karya JUARA',author_name:'EMANUELA ANNORA CALLYSTA',flipbook_url:'https://heyzine.com/flip-book/02197fcab9.html'},
    {title:'Karya JUARA',author_name:'GISELA NATHALY KRISTIAN',flipbook_url:'https://heyzine.com/flip-book/daf0248c90.html'},
    {title:'Karya JUARA',author_name:'GREISIA',flipbook_url:'https://heyzine.com/flip-book/bcf7135645.html'},
    {title:'Karya JUARA',author_name:'IGNATIUS AXXEL',flipbook_url:'https://heyzine.com/flip-book/e4d6a08fc6.html#page/9'},
    {title:'Karya JUARA',author_name:'JERICO BESTOFALL SIMANJUNTAK',flipbook_url:'https://heyzine.com/flip-book/7cf3b5bf98.html'},
    {title:'Karya JUARA',author_name:'JUNEVAN PRATAMA',flipbook_url:'https://heyzine.com/flip-book/647bedc1ce.html'},
    {title:'Karya JUARA',author_name:'MARSHA VELIJUNIA',flipbook_url:'https://heyzine.com/flip-book/491a73d63a.html'},
    {title:'Karya JUARA',author_name:'MUHAMMAD RIKI SYAHPUTRA',flipbook_url:'https://share.google/F94UfIPMiqOjL0mJ3'},
    {title:'Karya JUARA',author_name:'NATHANAEL ABEL PRATAMA',flipbook_url:'https://heyzine.com/flip-book/6869d32230.html#page/6'},
    {title:'Karya JUARA',author_name:'NI PUTU ARYA WIDHIYA CHRISTIANI',flipbook_url:'https://heyzine.com/flip-book/587ff89e24.html'},
    {title:'Karya JUARA',author_name:'REBY',flipbook_url:'https://heyzine.com/flip-book/9540308a3f.html'},
    {title:'Karya JUARA',author_name:'SAMUEL',flipbook_url:'https://heyzine.com/flip-book/4784684e6c.html#page/1'},
    {title:'Karya JUARA',author_name:'SHALOM GILBERT AMADEO',flipbook_url:'https://heyzine.com/flip-book/4784684e6c.html#page/1'},
    {title:'Karya JUARA',author_name:'THEOBALD APRILION PUTRA',flipbook_url:'https://heyzine.com/flip-book/4e1573f3d6.html'},
    {title:'Karya JUARA',author_name:'VICKO JULIO SETIAWAN',flipbook_url:'https://heyzine.com/flip-book/7ae31f6239.html'}
  ];
  const covers=['lib-cover-teal','lib-cover-green','lib-cover-gold','lib-cover-blue','lib-cover-purple','lib-cover-red','lib-cover-indigo','lib-cover-slate'];
  const catalogEl=document.getElementById('libraryCatalog'),searchEl=document.getElementById('librarySearch'),emptyEl=document.getElementById('libraryNoResult');
  const countEl=document.querySelector('.library-catalog-count');
  let catalog=fallbackCatalog;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderCatalog(){
    if(!catalogEl)return;
    const q=(searchEl?.value||'').toLowerCase().trim();
    const filtered=catalog.filter(x=>[x.title,x.author_name,x.category,x.synopsis].join(' ').toLowerCase().includes(q));
    catalogEl.innerHTML=filtered.map((x,i)=>{
      const cover=x.cover_url?`<div class="library-page-cover" style="background-image:url('${esc(x.cover_url)}');background-size:cover;background-position:center"><span>SMP NEGERI 7 KATINGAN HILIR</span></div>`:`<div class="library-page-cover ${covers[catalog.indexOf(x)%covers.length]}"><span>SMP NEGERI 7 KATINGAN HILIR</span><strong>${esc(x.title||'KARYA DIGITAL')}</strong><small>PERPUSTAKAAN DIGITAL MURID</small></div>`;
      return `<article class="library-page-card">${cover}<div class="library-page-card-body"><span class="library-page-category">${esc(x.category||'KARYA MURID')}</span><h3>${esc(x.title||'Karya JUARA')}</h3><div class="library-page-author">${esc(x.author_name||x.author||'')}</div><p>${esc(x.synopsis||'Karya literasi murid yang dibagikan sebagai bagian dari Perpustakaan Digital SMP Negeri 7 Katingan Hilir.')}</p>${x.flipbook_url?`<a class="button primary library-read-button" href="${esc(x.flipbook_url)}" target="_blank" rel="noopener">BACA KARYA ↗</a>`:'<span class="library-read-button">Link baca belum tersedia</span>'}</div></article>`;
    }).join('');
    if(emptyEl)emptyEl.hidden=filtered.length>0;
    if(countEl)countEl.textContent=`${catalog.length} karya digital`;
  }
  if(searchEl)searchEl.addEventListener('input',renderCatalog);
  if(window.supabaseClient){
    window.supabaseClient.from('digital_works').select('*').eq('status','published').order('featured',{ascending:false}).order('sort_order',{ascending:true}).then(({data,error})=>{
      if(error){console.warn('Katalog digital menggunakan data fallback:',error.message);renderCatalog();return;}
      if(data&&data.length)catalog=data;
      renderCatalog();
    });
  }
  renderCatalog();
  if(catalogEl)catalogEl.addEventListener('click',event=>{const card=event.target.closest('.library-page-card');if(!card||event.target.closest('.library-read-button'))return;const link=card.querySelector('.library-read-button');if(link&&link.href)window.open(link.href,'_blank','noopener');});
})();
