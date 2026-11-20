// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const open = navMenu.classList.contains('active');
    menuToggle.textContent = open ? '✕' : '☰';
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMenu.classList.remove('active'); menuToggle.textContent = '☰';
  }));
}

// Footer year
const year = document.getElementById('currentYear');
if (year) year.textContent = new Date().getFullYear();

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (backToTop) backToTop.classList.toggle('show', window.scrollY > 350);
});
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

// Demo library data. Replace with real flipbook links when available.
const books = [
  {title:'Petualangan di Tanah Dayak',author:'Karya Murid',category:'budaya',description:'Cerita tentang budaya, tradisi, dan kearifan lokal.',cover:'PETUALANGAN TANAH DAYAK',color:'book-cover'},
  {title:'Langkah Kecil, Impian Besar',author:'Karya Murid',category:'inspiratif',description:'Cerita tentang perjuangan dan semangat meraih cita-cita.',cover:'LANGKAH KECIL',color:'book-cover-2'},
  {title:'Sahabat di Balik Hujan',author:'Karya Murid',category:'cerpen',description:'Cerita persahabatan, kepedulian, dan kebersamaan.',cover:'SAHABAT DI BALIK HUJAN',color:'book-cover-3'},
  {title:'Suara dari Hutan',author:'Karya Murid',category:'puisi',description:'Kumpulan ungkapan tentang alam dan kehidupan.',cover:'SUARA DARI HUTAN',color:'book-cover-4'},
  {title:'Pantun untuk Bumi',author:'Karya Murid',category:'pantun',description:'Pantun kreatif tentang lingkungan dan kehidupan.',cover:'PANTUN UNTUK BUMI',color:'book-cover'},
  {title:'Belajar dari Sungai',author:'Karya Murid',category:'artikel',description:'Artikel tentang sungai, kehidupan, dan lingkungan.',cover:'BELAJAR DARI SUNGAI',color:'book-cover-2'}
];
const categoryLabels = {cerpen:'CERITA PENDEK',puisi:'PUISI',pantun:'PANTUN',artikel:'ARTIKEL',budaya:'CERITA BUDAYA',inspiratif:'INSPIRATIF'};
const bookGrid = document.getElementById('bookGrid');
const search = document.getElementById('bookSearch');
const category = document.getElementById('bookCategory');
const empty = document.getElementById('libraryEmpty');
function renderBooks(){
  if(!bookGrid) return;
  const query = (search?.value || '').toLowerCase().trim();
  const cat = category?.value || 'all';
  const result = books.filter(b => (cat==='all'||b.category===cat) && `${b.title} ${b.author} ${b.description}`.toLowerCase().includes(query));
  bookGrid.innerHTML = result.map(b => `<article class="book-card"><div class="book-cover ${b.color}"><div class="book-cover-content"><span>SMP NEGERI 7 KATINGAN HILIR</span><strong>${b.cover}</strong></div></div><div class="book-body"><span class="book-category">${categoryLabels[b.category]||'KARYA MURID'}</span><h3>${b.title}</h3><div class="book-author">${b.author}</div><p>${b.description}</p><a class="book-link" href="#" aria-label="Flipbook ${b.title}">Flipbook belum ditautkan →</a></div></article>`).join('');
  if(empty) empty.hidden = result.length > 0;
}
search?.addEventListener('input',renderBooks);
category?.addEventListener('change',renderBooks);
renderBooks();

// Homepage announcement cards — load published items from Supabase when available.
const announcementList = document.getElementById('announcementList');
const demoAnnouncements = [
 {day:'20',month:'NOV',type:'INFORMASI SEKOLAH',title:'Selamat Datang di Website SMP Negeri 7 Katingan Hilir',desc:'Website sekolah sebagai pusat informasi dan dokumentasi kegiatan.'},
 {day:'18',month:'NOV',type:'PROGRAM SEKOLAH',title:'Program Unggulan dan Inovasi Sekolah',desc:'Mengenal program yang mendukung perkembangan potensi murid.'},
 {day:'15',month:'NOV',type:'LITERASI',title:'Perpustakaan Digital Murid',desc:'Ruang publikasi karya literasi murid dalam bentuk digital.'}
];
async function renderHomepageAnnouncements(){
  if(!announcementList)return;
  let cards=demoAnnouncements;
  try{
    if(window.supabaseClient){
      const {data,error}=await window.supabaseClient.from('announcements').select('title,category,content,published_at,created_at').eq('status','published').order('published_at',{ascending:false}).limit(3);
      if(error)throw error;
      if(data?.length)cards=data.map(a=>{const dt=(a.published_at||a.created_at||'').slice(0,10);return {day:dt.slice(8,10)||'—',month:dt.slice(5,7)||'',type:a.category||'INFORMASI',title:a.title,desc:a.content};});
    }
  }catch(err){console.warn('Pengumuman Supabase belum dapat dimuat:',err);}
  announcementList.innerHTML=cards.map(a=>`<article class="announcement-item"><div class="announcement-date"><strong>${a.day||'—'}</strong><span>${a.month||''}</span></div><div class="announcement-info"><span>${a.type||''}</span><h3>${a.title||''}</h3><p>${a.desc||''}</p></div></article>`).join('') + '<a class="button primary" href="pengumuman.html">Semua Pengumuman →</a>';
}
renderHomepageAnnouncements();
// Guestbook demo only: no backend or permanent storage yet
const guestForm = document.getElementById('guestbookForm');
guestForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('guestName').value.trim();
  const purpose=document.getElementById('guestPurpose').value;
  const message=document.getElementById('guestMessage').value.trim();
  if(!name||!purpose||!message){alert('Mohon lengkapi data wajib.');return;}
  const guests=(()=>{try{return JSON.parse(localStorage.getItem('smpn7_guestbook_v1')||'[]')}catch{return []}})();guests.push({id:Date.now().toString(),name,institution:document.getElementById('guestInstitution').value.trim(),purpose,message,date:new Date().toISOString(),status:'pending'});localStorage.setItem('smpn7_guestbook_v1',JSON.stringify(guests));alert(`Terima kasih, ${name}! Pesan tersimpan pada prototipe dan menunggu moderasi admin.`);guestForm.reset();
});
console.info('SMP Negeri 7 Katingan Hilir website prototype loaded.');

// Gentle scroll reveal animations for section content (accessible: reduced-motion is respected by CSS).
const revealTargets = document.querySelectorAll('.section .container, .welcome-grid, .value-grid article, .hero-copy, .hero-image');
revealTargets.forEach((el, index) => { el.classList.add('reveal'); if(index % 4) el.classList.add(`reveal-delay-${index % 4}`); });
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
  }, {threshold: 0.12, rootMargin: '0px 0px -35px 0px'});
  revealTargets.forEach(el => revealObserver.observe(el));
} else { revealTargets.forEach(el => el.classList.add('is-visible')); }
