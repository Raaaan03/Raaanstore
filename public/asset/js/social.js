// === DOM ===
const detailPopup = document.getElementById("detailPopup"),
  detailBox = document.getElementById("detailBox"),
  guidePopup = document.getElementById("guidePopup"),
  guideBack = document.getElementById("guideBack"),
  guideOk = document.getElementById("guideOk"),
  confirmPopup = document.getElementById("confirmPopup"),
  confirmText = document.getElementById("confirmText"),
  confirmBack = document.getElementById("confirmBack"),
  confirmYes = document.getElementById("confirmYes"),
  loader = document.getElementById("loader"),
  container = document.getElementById("sosial-container"),
  mainContent = document.getElementById("mainContent");

const ADMIN_FEE = 100;

// Reset discounts daily
function resetDiscountsIfNeeded() {
  const today = new Date().toLocaleDateString();
  const lastDate = localStorage.getItem('discount_date');
  if (lastDate !== today) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('discount_')) localStorage.removeItem(key);
    });
    localStorage.setItem('discount_date', today);
  }
}
resetDiscountsIfNeeded();

let lastDetail = null;

// Info placeholder mapping
const infoTextMap = {
  followers: 'Link profil / username',
  subscribers: 'Link profil / username',
  views: 'Masukan link nya',
  likes: 'Masukan link nya'
};
// Transaction info per jenis
const transactionInfoMap = {
  followers: 'Premium Followers, refill 30 hari',
  subscribers: 'Premium Subscribers, refill 30 hari',
  views: 'Premium Views, refill 1 hari',
  likes: 'Premium Likes, refill 7 hari'
};

// === DETAIL POPUP ===
function openDetail(item) {
  const totalWithAdmin = item.discounted + ADMIN_FEE;
  // category key
  const catKey = item.kategori.toLowerCase().includes('followers') || item.kategori.toLowerCase().includes('subscriber')
    ? 'followers' : item.kategori.toLowerCase().includes('view') ? 'views' : 'likes';
  // build user input field
  const userField =
    `<label for="userLink">${infoTextMap[catKey]}:</label>` +
    `<input id="userLink" class="detail-input" type="text" placeholder="${infoTextMap[catKey]}" />`;

  detailBox.innerHTML = `
    <h3>Detail Pemesanan</h3>
    <p>Nama Aplikasi : <strong>${item.platform}</strong></p>
    <p>Type/Jenis    : <strong>${item.qty} ${item.kategori}</strong></p>
    <p>Harga Awal    : <strong>Rp${item.total.toLocaleString('id-ID')}</strong></p>
    <p>Diskon        : <strong>${item.discount}%</strong></p>
    <p>Harga Diskon  : <strong>Rp${item.discounted.toLocaleString('id-ID')}</strong></p>
    <p>Biaya Admin   : <strong>Rp${ADMIN_FEE.toLocaleString('id-ID')}</strong></p>
    <p><strong>Total Bayar : Rp${totalWithAdmin.toLocaleString('id-ID')}</strong></p>
    <div class="detail-user-field">
      ${userField}
    </div>
    <button class="btn-order">Order</button>
    <button class="btn-back">Kembali</button>
  `;
  detailPopup.style.display = 'flex';
  detailBox.querySelector('.btn-back').onclick = () => detailPopup.style.display = 'none';
  detailBox.querySelector('.btn-order').onclick = () => {
    const userLink = document.getElementById('userLink').value.trim();
    if (!userLink) {
      alert(infoTextMap[catKey]);
      return;
    }
    lastDetail = { ...item, totalWithAdmin, userLink, catKey };
    detailPopup.style.display = 'none';
    showGuidePopup(catKey);
  };
}

// Show guide with transaction info
function showGuidePopup(catKey) {
  const box = guidePopup.querySelector('.box');
  // remove existing info if any
  const old = box.querySelector('.guide-info');
  if (old) old.remove();
  // insert new info above buttons
  const infoP = document.createElement('p');
  infoP.className = 'guide-info';
  infoP.textContent = transactionInfoMap[catKey] || '';
  // insert before back button
  box.insertBefore(infoP, guideBack);
  guidePopup.style.display = 'flex';
}

// === GUIDE & CONFIRM ===
guideBack.onclick = () => guidePopup.style.display = 'none';
guideOk.onclick = () => {
  guidePopup.style.display = 'none';
  const userTxt = lastDetail.userLink ? `<br>Data pengguna: ${lastDetail.userLink}` : '';
  confirmText.innerHTML =
    `Apakah kamu ingin membeli Aplikasi Premium<br>` +
    `<strong>${lastDetail.platform}</strong> | ${lastDetail.qty} ${lastDetail.kategori}<br>` +
    `Total: <strong>Rp${lastDetail.totalWithAdmin.toLocaleString('id-ID')}</strong>` + userTxt;
  confirmPopup.style.display = 'flex';
};
confirmBack.onclick = () => confirmPopup.style.display = 'none';
confirmYes.onclick = () => {
  let text = `*DATA PEMBELIAN*\n\n` +
    `Aplikasi : ${lastDetail.platform}\n` +
    `Type     : ${lastDetail.qty} ${lastDetail.kategori}\n` +
    `Diskon   : ${lastDetail.discount}%\n` +
    `Harga    : Rp${lastDetail.discounted.toLocaleString('id-ID')}\n` +
    `Admin    : Rp${ADMIN_FEE.toLocaleString('id-ID')}\n` +
    `Total    : Rp${lastDetail.totalWithAdmin.toLocaleString('id-ID')}\n`;
  if (lastDetail.userLink) text += `Data pengguna: ${lastDetail.userLink}\n`;
  window.open(`https://wa.me/6287768966445?text=${encodeURIComponent(text)}`, '_blank');
};

// === NAV & RENDER ===
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = Array.from(document.querySelectorAll('.socmed-nav a'));
  navLinks.forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); navLinks.forEach(el=>el.classList.remove('active'));
    a.classList.add('active'); renderPlatform(a.getAttribute('data-platform'));
  }));
  const active = navLinks.find(a=>a.classList.contains('active')) || navLinks[0];
  active.classList.add('active'); renderPlatform(active.getAttribute('data-platform'));
});

function renderPlatform(raw) {
  const platform = raw.toLowerCase(); mainContent.style.display='block'; loader.style.display='flex';
  loader.innerHTML=`<span class="loader"></span><div class="loader-text">Sabar ya, lagi load…</div>`;
  container.innerHTML=''; setTimeout(()=>{
    const list = baseCosts.filter(b=>b.platform===platform);
    if(!list.length){ loader.innerHTML='<p>Data tidak ditemukan 😭</p>'; return; }
    loader.style.display='none'; renderItems(platform);
  },500);
}

function renderItems(platform) {
  const cats=[...new Set(baseCosts.filter(b=>b.platform===platform).map(b=>b.kategori))]; container.innerHTML='';
  cats.forEach((kategori,idx)=>{
    const qtys=kategori.toLowerCase().includes('view')?[5000,10000,20000]
      :kategori.toLowerCase().includes('like')?[1000,5000,10000]:[100,500,1000];
    const sec=document.createElement('div'); sec.className='category-section'; sec.innerHTML=`<h3>${kategori}</h3>`; container.appendChild(sec);
    const base=baseCosts.find(b=>b.platform===platform&&b.kategori===kategori).price;
    qtys.forEach((q,i)=>{
      const total=base*q; const key=`discount_${platform}_${kategori}_${q}`;
      let discount=parseInt(localStorage.getItem(key)); if(isNaN(discount)){ discount=Math.random()<0.99?Math.floor(Math.random()*6)+1:Math.floor(Math.random()*4)+7; localStorage.setItem(key,discount);}      
      const discounted=Math.round(total*(100-discount)/100); const final=discounted+ADMIN_FEE;
      const item=document.createElement('div'); item.className='item'; item.style.position='relative'; item.style.animationDelay=`${(idx*qtys.length+i)*0.1}s`;
      item.innerHTML=`<span>${q.toLocaleString('id-ID')} ${kategori}</span><span>Rp${final.toLocaleString('id-ID')}</span><div class="badge-discount">-${discount}%</div>`;
      item.onclick=()=>openDetail({platform,kategori,qty:q,total,discount,discounted}); sec.appendChild(item);
    });
    // custom
    const custom=document.createElement('div'); custom.className='item'; custom.style.position='relative'; custom.style.animationDelay=`${(idx*qtys.length+qtys.length)*0.1}s`;
    custom.innerHTML=`<span><input class="custom-input" type="number" min="100" placeholder="Custom (min.100)"/> ${kategori}</span><span class="custom-price">–</span><div class="badge-discount">DISKON</div>`;
    sec.appendChild(custom);
    const inp=custom.querySelector('.custom-input'), pr=custom.querySelector('.custom-price'); inp.addEventListener('click', e=>e.stopPropagation());
    inp.oninput=()=>{ const v=parseInt(inp.value)||0; if(v>=100){ const tot=base*v; const k=`discount_${platform}_${kategori}_${v}`; let d=parseInt(localStorage.getItem(k)); if(isNaN(d)){ d=Math.random()<0.99?Math.floor(Math.random()*6)+1:Math.floor(Math.random()*4)+7; localStorage.setItem(k,d);} const dp=Math.round(tot*(100-d)/100), f=dp+ADMIN_FEE; pr.textContent=`Rp${f.toLocaleString('id-ID')}`; custom.querySelector('.badge-discount').textContent=`-${d}%`; } else { pr.textContent='–'; custom.querySelector('.badge-discount').textContent=''; }};
    custom.onclick=()=>{ const v=parseInt(inp.value)||0; if(v<100) alert('Masukkan jumlah minimal 100'); else openDetail({platform,kategori,qty:v,total:base*v,discount:parseInt(localStorage.getItem(`discount_${platform}_${kategori}_${v}`)),discounted:Math.round(base*v*(100-parseInt(localStorage.getItem(`discount_${platform}_${kategori}_${v}`)))/100)});
    };
  });
}

const baseCosts=[
  {platform:'tiktok',kategori:'Followers Garansi',price:37},
  {platform:'tiktok',kategori:'Views Fast',price:0.12},
  {platform:'tiktok',kategori:'Likes Garansi',price:4},
  {platform:'instagram',kategori:'Followers Garansi',price:32},
  {platform:'instagram',kategori:'Likes',price:5},
  {platform:'instagram',kategori:'Views',price:3.5},
  {platform:'youtube',kategori:'Subscribers',price:79},
  {platform:'youtube',kategori:'Views',price:17.5},
  {platform:'youtube',kategori:'Likes',price:20}
];
