// Galeri menggunakan elemen details/summary native browser untuk membuka album.
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.gallery-filter-btn').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.gallery-filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); const filter=btn.dataset.filter;
    document.querySelectorAll('.album-card').forEach(card=>card.hidden=!(filter==='all'||card.dataset.category===filter));
  }));
});
