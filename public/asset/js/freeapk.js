const mediafireLinks = [
  "https://www.mediafire.com/files/1pb321lhdjs1sdpy/Temp_Mail_Premium-.apk",
  "https://www.mediafire.com/files/1669920atdl5bpkl/qris No ktp (orderkouta)-.apk",
  "https://www.mediafire.com/files/1xgqnit32ysvkmp2/Pixellab_Logo-.apk",
  "https://www.mediafire.com/files/1ke7ous4w9y6qtnj/KENON_WA_by_Raaan_Script-.apk",
  "https://www.mediafire.com/files/1b9ov3a4ljtas3qp/JPM-.apk",
  "https://www.mediafire.com/files/1i0eha6dgl073ln9/FAKE_DANA_NOTIFIKASI-.apk",
  "https://www.mediafire.com/files/15tf8jbbb5iep44c/E-KTP_Simulasi-.apk",
  "https://www.mediafire.com/files/1tm7bdnkw5dveuty/BANNED_PRIVATE_ -.apk",
  "https://www.mediafire.com/files/19vn2g6pmsn3eef0/BANNED_GMAIL-.apk",
  "https://www.mediafire.com/files/1un8pblotchlveth/BANNED_UNBANNED_NUMBER-.apk",
  "https://www.mediafire.com/files/1iuvkimwm53z7bgo/BANIDO_ELIT-.apk",
  "https://www.mediafire.com/files/15qvmthqm7pztht9/AutoSave_Contact-.apk",
  "https://www.mediafire.com/files/1hw3zuno6czy7faj/APK_KENON-.apk",
  "https://www.mediafire.com/files/1e3r0z0autawmpqv/Apk push kontak via replit-.apk",
  "https://www.mediafire.com/files/10fk2mcmxr08atv1/APK_BEKU_PAYMENT-.apk"
];

const shortLinks = [
  "https://sfl.gl/xTJu","https://sfl.gl/8qSS4qNT","https://sfl.gl/pcLWy",
  "https://sfl.gl/Oq3uBTbW","https://sfl.gl/meN1","https://sfl.gl/vGG8i",
  "https://sfl.gl/wYmSF","https://sfl.gl/Sj3Ps6","https://sfl.gl/Y79jQzg",
  "https://sfl.gl/rQ6g","https://sfl.gl/f3fVSjT","https://sfl.gl/sNHHuE5n",
  "https://sfl.gl/hzMHqm","https://sfl.gl/nDco9p","https://sfl.gl/qSQzC"
];

const perPage = 5;
let currentPage = 1;
let targetUrl = "";

function getName(url){
  // Ambil nama file dan ganti _ jadi spasi
  return decodeURIComponent(url.split("/").pop()).replace(/_/g, " ").trim();
}

function renderPage(page){
  const list = document.getElementById("file-list");
  list.innerHTML = "";
  const start = (page - 1) * perPage;
  mediafireLinks.slice(start, start + perPage).forEach((url, i) => {
    const idx = start + i;
    const box = document.createElement("div");
    box.className = "file-box";
    box.style.animationDelay = `${i * 0.1}s`;
    box.innerHTML = `
      <div class="file-name">${getName(url)}</div>
      <div class="file-url">${url}</div>
    `;
    box.onclick = () => {
      targetUrl = shortLinks[idx];
      document.getElementById("popup").style.display = "flex";
    };
    list.appendChild(box);
  });
  renderPagination();
}

function renderPagination(){
  const pag = document.getElementById("pagination");
  pag.innerHTML = "";
  const total = Math.ceil(mediafireLinks.length / perPage);
  for(let i = 1; i <= total; i++){
    const btn = document.createElement("button");
    btn.textContent = i;
    if(i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      renderPage(i);
    };
    pag.appendChild(btn);
  }
}

document.getElementById("btnYes").onclick = () => {
  window.location.href = targetUrl;
};

document.getElementById("btnNo").onclick = () => {
  document.getElementById("popup").style.display = "none";
};

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("mainContent").style.display = "flex";
    renderPage(1);
  }, 800);
});
