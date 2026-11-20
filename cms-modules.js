/* CMS modules: programs, achievements, gallery albums. Admin-only through Supabase RLS. */
(() => {
  'use strict';
  const db = window.supabaseClient;
  const root = document.getElementById('cmsModuleContent');
  if (!root) return;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug = s => String(s || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,80);
  const modules = {
    programs: {table:'programs',title:'Program Sekolah',fields:[
      ['title','Nama Program','text',true],['icon','Ikon/Emoji','text',false],['cover_url','URL Foto Sampul','url',false],['summary','Ringkasan','textarea',true],['body','Deskripsi Lengkap','textarea',false],['schedule','Jadwal','text',false],['impact','Dampak','textarea',false],['status','Status','status',true],['sort_order','Urutan Tampil','number',false]
    ], columns:['title','summary','status'], defaults:{status:'draft',sort_order:0}},
    achievements: {table:'achievements',title:'Prestasi',fields:[
      ['title','Nama Prestasi','text',true],['recipient','Penerima (murid/guru/sekolah)','text',true],['category','Kategori','text',true],['level','Tingkat','text',false],['achievement_year','Tahun','number',false],['description','Deskripsi','textarea',false],['photo_url','URL Foto','url',false],['certificate_url','URL Sertifikat','url',false],['status','Status','status',true]
    ],columns:['title','recipient','category','status'],defaults:{category:'murid',status:'draft'}},
    gallery_albums: {table:'gallery_albums',title:'Album Galeri',fields:[
      ['title','Judul Album','text',true],['category','Kategori','text',true],['album_date','Tanggal Album','date',false],['description','Deskripsi','textarea',false],['cover_url','URL Foto Sampul','url',false],['status','Status','status',true],['sort_order','Urutan Tampil','number',false]
    ],columns:['title','category','status'],defaults:{category:'Kegiatan Sekolah',status:'draft',sort_order:0}}
  };
  let active = 'programs';
  let records = [];
  let editing = null;
  function input(field){
    const [key,label,type,required]=field;
    const val=editing?.[key] ?? modules[active].defaults?.[key] ?? '';
    if(type==='textarea') return `<label class="cms-field">${esc(label)}<textarea name="${key}" ${required?'required':''} rows="3">${esc(val)}</textarea></label>`;
    if(type==='status') return `<label class="cms-field">${esc(label)}<select name="${key}" required><option value="draft" ${val==='draft'?'selected':''}>Draft</option><option value="published" ${val==='published'?'selected':''}>Terbit</option><option value="archived" ${val==='archived'?'selected':''}>Arsip</option></select></label>`;
    return `<label class="cms-field">${esc(label)}<input name="${key}" type="${type}" value="${esc(val)}" ${required?'required':''}></label>`;
  }
  function renderForm(){const m=modules[active];root.innerHTML=`<h3>Kelola ${esc(m.title)}</h3><form id="cmsForm" class="admin-form"><input type="hidden" name="id" value="${esc(editing?.id||'')}"><div class="cms-fields">${m.fields.map(input).join('')}</div><div class="admin-form-actions"><button class="primary-action" type="submit">${editing?'Simpan Perubahan':'Tambah '+esc(m.title)}</button><button class="secondary-action" type="button" id="cmsReset">${editing?'Batal Edit':'Reset'}</button></div></form><div class="admin-list"><h3>Daftar ${esc(m.title)}</h3><div id="cmsList"></div></div>`;
    root.querySelector('#cmsReset').onclick=()=>{editing=null;renderForm();};
    root.querySelector('#cmsForm').onsubmit=save;
    renderList();
  }
  function renderList(){const list=root.querySelector('#cmsList');if(!list)return;const m=modules[active];list.innerHTML=records.length?records.map(r=>`<div class="admin-row"><h4>${esc(r.title||'')} <span class="status-tag">${esc(r.status||'draft')}</span></h4><p>${esc(r[m.columns[1]]||r.category||'')}</p><div class="admin-actions"><button type="button" data-edit="${esc(r.id)}">Edit</button><button type="button" data-status="${esc(r.id)}">${r.status==='published'?'Tarik Terbit':'Terbitkan'}</button><button type="button" data-delete="${esc(r.id)}">Hapus</button></div></div>`).join(''):'<p class="empty">Belum ada data.</p>';
    list.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{editing=records.find(x=>x.id===b.dataset.edit);renderForm();root.scrollIntoView({behavior:'smooth'});});
    list.querySelectorAll('[data-status]').forEach(b=>b.onclick=async()=>{const r=records.find(x=>x.id===b.dataset.status);if(!r)return;const status=r.status==='published'?'draft':'published';const {error}=await db.from(m.table).update({status}).eq('id',r.id);if(error)return alert('Status gagal diubah: '+error.message);await load();});
    list.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('Hapus data ini?'))return;const {error}=await db.from(m.table).delete().eq('id',b.dataset.delete);if(error)return alert('Hapus gagal: '+error.message);await load();});
  }
  async function load(){if(!db){root.innerHTML='<p class="empty">Supabase belum siap.</p>';return;}root.innerHTML='<p class="empty">Memuat...</p>';const {data,error}=await db.from(modules[active].table).select('*').order('created_at',{ascending:false});if(error){root.innerHTML=`<p class="empty">Gagal memuat: ${esc(error.message)}</p>`;return;}records=data||[];renderForm();}
  async function save(e){e.preventDefault();const m=modules[active];const fd=new FormData(e.currentTarget);const payload={};m.fields.forEach(([key,,type])=>{let v=fd.get(key);if(type==='number')v=v===''?null:Number(v);else if(type==='url')v=v||null;else v=(v||'').trim();payload[key]=v;});if(active==='programs')payload.slug=slug(payload.title)+(editing?'':'-'+Date.now().toString().slice(-4));if(editing)payload.updated_at=new Date().toISOString();const btn=e.currentTarget.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Menyimpan...';try{const result=editing?await db.from(m.table).update(payload).eq('id',editing.id):await db.from(m.table).insert(payload);if(result.error)throw result.error;editing=null;await load();alert('Data berhasil disimpan.');}catch(err){alert('Gagal menyimpan: '+err.message);}finally{btn.disabled=false;}}
  document.querySelectorAll('[data-cms-module]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-cms-module]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');active=btn.dataset.cmsModule;editing=null;load();}));
  const style=document.createElement('style');style.textContent='.cms-module-wrap{margin-top:24px}.cms-module-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0}.cms-module-tabs button{padding:10px 14px;border:1px solid #dbe3ee;border-radius:10px;background:white;cursor:pointer}.cms-module-tabs button.active{background:#2f5597;color:white}.cms-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.cms-field{display:flex;flex-direction:column;gap:6px;font-weight:600}.cms-field input,.cms-field textarea,.cms-field select{width:100%;padding:10px;border:1px solid #d6deeb;border-radius:8px;font:inherit;font-weight:400}.cms-field textarea{min-height:90px}.cms-module-wrap .admin-row{margin:12px 0;padding:14px;border:1px solid #e4eaf2;border-radius:12px}.cms-module-wrap .admin-actions{display:flex;flex-wrap:wrap;gap:8px}';document.head.appendChild(style);
  load();
})();
