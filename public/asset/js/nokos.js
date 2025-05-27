document.addEventListener("DOMContentLoaded", () => {
      const loader = document.getElementById("loader"),
        inNeg = document.getElementById("search-negara"),
        inLay = document.getElementById("search-layanan"),
        barC = document.getElementById("country-bar"),
        barS = document.getElementById("service-bar"),
        grid = document.getElementById("nokos-grid"),
        pag = document.getElementById("pagination"),
        popup = document.getElementById("popup"),
        list = document.getElementById("popupList"),
        detailPopup = document.getElementById("detailPopup"),
        detailBox = document.getElementById("detailBox"),
        guidePopup = document.getElementById("guidePopup"),
        guideBack = document.getElementById("guideBack"),
        guideOk = document.getElementById("guideOk"),
        confirmPopup = document.getElementById("confirmPopup"),
        confirmText = document.getElementById("confirmText"),
        confirmBack = document.getElementById("confirmBack"),
        confirmYes = document.getElementById("confirmYes");

      let countries = [], dataKos = [], filteredKos = [],
        activeCountryId = null, mode = 'single',
        itemsPerPage = 10, currentPage = 1, lastDetail = null;

      const isBlack = n => ["casino online", "slot", "judi", "togel", "yandex", "poker"]
        .some(k => n.toLowerCase().includes(k));
      const hsl = (i, t) => `hsl(${Math.round(360 * (i / t))},60%,65%)`;

      function showLoader() { loader.style.display = 'flex'; grid.innerHTML = ''; pag.innerHTML = ''; }
      function hideLoader() { loader.style.display = 'none'; document.body.classList.remove('loading'); }

      function renderPage(page) {
        showLoader();
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage;
          const slice = filteredKos.slice(start, start + itemsPerPage);
          grid.innerHTML = '';
          slice.sort((a, b) => (b.countryId === activeCountryId) - (a.countryId === activeCountryId))
            .forEach((it, idx) => {
              const d = document.createElement('div');
              d.className = 'premium-item';
              d.style.animationDelay = `${idx * 100}ms`;
              d.innerHTML = `
              <h3 style="color:${it.color}">${it.countryName}</h3>
              <div class="premium-price">
                <span>${it.layanan}</span>
                <span>${it.hargaJual === null ? 'Tidak ada' : 'Rp' + new Intl.NumberFormat('id-ID').format(it.hargaJual)}</span>
              </div>`;
              d.onclick = () => openDetail(it);
              grid.appendChild(d);
            });
          pag.innerHTML = '';
          const pages = Math.ceil(filteredKos.length / itemsPerPage);
          for (let i = 1; i <= pages; i++) {
            const b = document.createElement('button');
            b.textContent = i; if (i === page) b.classList.add('active');
            b.onclick = () => { currentPage = i; renderPage(i) };
            pag.appendChild(b);
          }
          hideLoader();
        }, 0);
      }

      function buildBarC() {
        barC.innerHTML = '';
        const allB = document.createElement('button');
        allB.innerHTML = '<i class="fas fa-th-large"></i>';
        allB.classList.add('all-btn');
        allB.onclick = () => openPopup('C');
        barC.appendChild(allB);
        const act = countries.find(c => c.id === activeCountryId);
        const btnA = document.createElement('button');
        btnA.textContent = act.name; btnA.style.color = act.color; btnA.classList.add('active');
        barC.appendChild(btnA);
        const q = inNeg.value.toLowerCase();
        countries.filter(c => c.id !== activeCountryId && c.name.toLowerCase().includes(q))
          .slice(0, 4).forEach(c => {
            const b = document.createElement('button');
            b.textContent = c.name; b.style.color = c.color;
            b.onclick = () => selectCountry(c.id);
            barC.appendChild(b);
          });
      }

      function buildBarS() {
        barS.innerHTML = '';
        if (!inLay.value.trim()) { barS.style.display = 'none'; return; }
        barS.style.display = 'flex';
        ['Single', 'Multi'].forEach(m => {
          const b = document.createElement('button');
          b.textContent = m; if (mode === m.toLowerCase()) b.classList.add('active');
          b.onclick = () => { mode = m.toLowerCase(); applyFilter(); buildBarS() };
          barS.appendChild(b);
        });
        const allB = document.createElement('button');
        allB.innerHTML = '<i class="fas fa-th-large"></i>';
        allB.classList.add('all-btn');
        allB.onclick = () => openPopup('S');
        barS.appendChild(allB);
      }

      function applyFilter() {
        const q = inLay.value.toLowerCase();
        filteredKos = dataKos.filter(item => {
          if (isBlack(item.layanan)) return false;
          if (!item.layanan.toLowerCase().includes(q)) return false;
          if (mode === 'single' && item.countryId !== activeCountryId) return false;
          return true;
        });
        currentPage = 1; renderPage(1);
      }

      function openPopup(type) {
        popup.innerHTML = '';
        const div = document.createElement('div'); div.className = 'inner';
        const title = document.createElement('h3');
        title.textContent = type === 'C' ? 'Pilih negara mana nomornya' : 'Pilih yang dibutuhkan';
        div.appendChild(title);
        if (type === 'C') {
          countries.forEach(c => {
            const b = document.createElement('button');
            b.textContent = c.name; b.style.color = c.color;
            b.onclick = () => { popup.style.display = 'none'; selectCountry(c.id) };
            div.appendChild(b);
          });
        } else {
          [...new Set(dataKos.map(i => i.layanan))].forEach(l => {
            const b = document.createElement('button');
            b.textContent = l;
            b.onclick = () => { popup.style.display = 'none'; inLay.value = l; applyFilter(); buildBarS() };
            div.appendChild(b);
          });
        }
        popup.appendChild(div); popup.style.display = 'flex';
        popup.onclick = e => { if (e.target === popup) popup.style.display = 'none' };
      }

      function selectCountry(id) {
        activeCountryId = id; inNeg.value = ''; inLay.value = ''; mode = 'single';
        filteredKos = dataKos.filter(x => x.countryId === id);
        buildBarC(); buildBarS(); renderPage(1);
      }

      /* Popup 1: Detail */
      function openDetail(item) {
        lastDetail = item;
        detailBox.innerHTML = `
        <h3>Detail Pemesanan</h3>
        <p>Nama Item : Nokos (Nomor Virtual)
        <p>Negara: ${item.countryName}</p>
        <p>Layanan: ${item.layanan}</p>
        <p>Penyedia Provider : Random</p>
        <p>Harga: ${item.hargaJual === null ? 'Tidak ada' : 'Rp' + new Intl.NumberFormat('id-ID').format(item.hargaJual)}</p>
        <button class="btn-order">Order</button>
        <button class="btn-back">Kembali</button>`;
        detailPopup.style.display = 'flex';
        detailPopup.onclick = e => { if (e.target === detailPopup) detailPopup.style.display = 'none' };
        detailBox.querySelector('.btn-back').onclick = () => detailPopup.style.display = 'none';
        detailBox.querySelector('.btn-order').onclick = () => showGuide();
      }

      /* Popup 2: Guide */
      function showGuide() {
        detailPopup.style.display = 'none';
        guidePopup.style.display = 'flex';
      }
      guideBack.onclick = () => guidePopup.style.display = 'none';
      guideOk.onclick = () => {
        guidePopup.style.display = 'none';
        showConfirm();
      };

      /* Popup 3: Confirm */
      function showConfirm() {
        confirmText.innerHTML =
          `Apakah kamu ingin membeli<br>
         Nokos dengan nomor dari <strong>${lastDetail.countryName}</strong>, Menggunakan random provider, untuk layanan <strong>${lastDetail.layanan}</strong><br>
         dengan harga <strong>${lastDetail.hargaJual === null ? 'Tidak ada' : 'Rp' + new Intl.NumberFormat('id-ID').format(lastDetail.hargaJual)}</strong>?`;
        confirmPopup.style.display = 'flex';
      }
      confirmBack.onclick = () => confirmPopup.style.display = 'none';
      confirmYes.onclick = () => {
        const harga = lastDetail.hargaJual === null ? 'Tidak ada' : 'Rp' + new Intl.NumberFormat('id-ID').format(lastDetail.hargaJual);
        const text = `*DATA PEMBELIAN*%0A%0ANama Item: Nokos (Nomor Virtual)%0ANegara: ${encodeURIComponent(lastDetail.countryName)}%0APenyedia Layanan: Random%0ALayanan: ${encodeURIComponent(lastDetail.layanan)}%0AHarga: ${encodeURIComponent(harga)}%0A[0]`;
        window.open(`https://wa.me/6287768966445?text=${text}`, '_blank');
      };

      /* Events */
      inNeg.oninput = buildBarC;
      inLay.oninput = () => { applyFilter(); buildBarS() };

      /* Load data */
      fetch('/api/countries').then(r => r.json()).then(lst => {
        lst.forEach((c, i) => c.color = hsl(i, lst.length));
        countries = lst;
        const idx = lst.findIndex(c => c.id === 6);
        activeCountryId = idx >= 0 ? lst[idx].id : lst[0].id;
        Promise.all(countries.map(ct =>
          fetch(`/api/layanan?negara=${ct.id}`)
            .then(r => r.json())
            .then(arr => arr.filter(i => !isBlack(i.layanan))
              .map(i => ({
                ...i,
                countryId: ct.id,
                countryName: ct.name,
                color: ct.color
              }))
            )
        )).then(bl => {
          dataKos = [].concat(...bl);
          filteredKos = dataKos.filter(x => x.countryId === activeCountryId);
          buildBarC(); buildBarS(); renderPage(1);
          hideLoader();
        });
      });
    });