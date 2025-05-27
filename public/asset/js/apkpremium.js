const premiumList = [
  { nama: "Alight Motion", jenis: "IOS / ANDROID 1 TAHUN", harga: "Rp15.000" },
  { nama: "YouTube", jenis: "1 Bulan (Akun Buyer)", harga: "Rp10.000" },
  { nama: "YouTube", jenis: "1 bulan (Akun admin/private)", harga: "Rp15.000" },
  { nama: "YouTube", jenis: "FamHead", harga: "Rp40.000" },
  { nama: "Spotify", jenis: "1 bulan Garansi", harga: "Rp25.000" },
  { nama: "CapCut", jenis: "1 bulan Private", harga: "Rp30.000" },
  { nama: "CapCut", jenis: "7 Hari sharing", harga: "Rp8.000" },
  { nama: "Bstation", jenis: "1 bulan sharing", harga: "Rp20.000" },
  { nama: "Bstation", jenis: "1 bulan private", harga: "Rp35.000" },
  { nama: "Wink", jenis: "7 Hari", harga: "Rp15.000" },
  { nama: "ChatGPT", jenis: "1 Minggu (sharing)", harga: "Rp18.000" },
  { nama: "ChatGPT", jenis: "1 Bulan (sharing)", harga: "Rp60.000" },
  { nama: "iQiyi", jenis: "1 Bulan (sharing)", harga: "Rp17.000" },
  { nama: "iQiyi", jenis: "1 Bulan (private)", harga: "Rp35.000" },
  { nama: "Netflix", jenis: "1 Profil (2 User)", harga: "Rp20.000" },
  { nama: "Netflix", jenis: "1 Profil (1 User)", harga: "Rp30.000" },
  { nama: "Netflix", jenis: "1 Bulan (private)", harga: "Rp125.000" },
  { nama: "Vidio", jenis: "Platinum 1 Bulan (sharing)", harga: "Rp25.000" },
  { nama: "Vidio", jenis: "Platinum 2 Bulan TV ONLY", harga: "Rp20.000" },
  { nama: "Vidio", jenis: "Platinum 1 Bulan (private)", harga: "Rp33.000" },
  { nama: "Vidio", jenis: "Diamond Mobile 30 Hari", harga: "Rp55.000" },
];

const grouped = premiumList.reduce((acc, item) => {
  (acc[item.nama] ||= []).push(item);
  return acc;
}, {});

const grid = document.getElementById('premium-grid');
const detailPopup = document.getElementById('detailPopup');
const detailBox = document.getElementById('detailBox');
const guidePopup = document.getElementById('guidePopup');
const guideBack = document.getElementById('guideBack');
const guideOk = document.getElementById('guideOk');
const confirmPopup = document.getElementById('confirmPopup');
const confirmText = document.getElementById('confirmText');
const confirmBack = document.getElementById('confirmBack');
const confirmYes = document.getElementById('confirmYes');
const loader = document.getElementById('loader');
const mainContent = document.getElementById('mainContent');

let lastDetail = null;

function openDetail(item) {
  lastDetail = item;
  detailBox.innerHTML = `
    <h3>Detail Pemesanan</h3>
    <p>Nama Aplikasi: <strong>${item.nama}</strong></p>
    <p>Type/Jenis : <strong>${item.jenis}</strong></p>
    <p>Harga: <strong>${item.harga}</strong></p>
    <button class="btn-order">Order</button>
    <button class="btn-back">Kembali</button>
  `;
  detailPopup.style.display = 'flex';
  detailBox.querySelector('.btn-back').onclick = () => detailPopup.style.display = 'none';
  detailBox.querySelector('.btn-order').onclick = () => {
    detailPopup.style.display = 'none';
    guidePopup.style.display = 'flex';
  };
}

guideBack.onclick = () => guidePopup.style.display = 'none';

guideOk.onclick = () => {
  guidePopup.style.display = 'none';
  confirmText.innerHTML = `
    Apakah kamu ingin membeli<br>
    <strong>${lastDetail.nama}</strong> | ${lastDetail.jenis}<br>
    dengan harga <strong>${lastDetail.harga}</strong>?`;
  confirmPopup.style.display = 'flex';
};

confirmBack.onclick = () => confirmPopup.style.display = 'none';

confirmYes.onclick = () => {
  const txt = `*DATA PEMBELIAN*\nNama Aplikasi: ${lastDetail.nama}\nJenis: ${lastDetail.jenis}\nHarga: ${lastDetail.harga}`;
  window.open(`https://wa.me/6287768966445?text=${encodeURIComponent(txt)}`, '_blank');
};

function tampilkanGrid() {
  Object.entries(grouped).forEach(([name, items], i) => {
    const title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = name;
    grid.appendChild(title);

    const inner = document.createElement('div');
    inner.className = 'premium-grid-inner';

    items.forEach((it, j) => {
      const card = document.createElement('div');
      card.className = 'premium-item';
      card.style.animationDelay = `${(i * 10 + j) * 0.1}s`;
      card.innerHTML = `
        <h3>${it.nama}</h3>
        <div class="premium-price">
          <span>${it.jenis}</span><span>${it.harga}</span>
        </div>`;
      card.onclick = () => openDetail(it);
      inner.appendChild(card);
    });

    grid.appendChild(inner);
  });
}

function tampilkanLoaderBertahap(namaList, durasiTotal = 1000) {
  const loaderText = document.querySelector('.loader-text');
  let i = 0;
  const delay = durasiTotal / namaList.length;

  const interval = setInterval(() => {
    loaderText.textContent = `Memuat ${namaList[i]}…`;
    i++;
    if (i >= namaList.length) {
      clearInterval(interval);
      setTimeout(() => {
        loader.style.display = 'none';
        mainContent.style.display = 'block';
      }, 500);
    }
  }, delay);
}

window.addEventListener('load', () => {
  const semuaNama = [...new Set(premiumList.map(e => e.nama))];
  tampilkanLoaderBertahap(semuaNama);
  tampilkanGrid();
});
