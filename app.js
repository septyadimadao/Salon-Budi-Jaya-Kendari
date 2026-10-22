/* =========================================================
   ISI DATA SALON DI SINI (berlaku untuk semua halaman)
   ========================================================= */
const DATA = {
  wa: "6282255871937", // 0822-5587-1937; contoh: "6281234567890" (pakai 62, tanpa + dan tanpa 0 di depan)
  instagram: "https://www.instagram.com/budi_jaya.gallery/", // contoh: "https://instagram.com/namaakun"
  facebook: "",
  tiktok: "",
  maps: "",        // tautan pin Google Maps (boleh kosong, otomatis pakai koordinat)
  lat: "-3.965472",
  lng: "122.519148",
  zoom: 17
};
/* ========================================================= */

/* =========================================================
   ULASAN PELANGGAN (hanya ulasan asli, dengan izin pelanggan)
   Salin satu baris contoh di bawah, hapus tanda // di depannya,
   lalu ganti isinya. Kontak boleh dikosongkan.
   ========================================================= */
const REVIEWS = [
  // { nama: "Nama Pelanggan", kontak: "nama@gmail.com", bintang: 5, layanan: "Rias Pengantin & Make Up", ulasan: "Isi ulasan dari pelanggan.", tanggal: "2026-10-22" },
];
/* ========================================================= */

/* selalu mulai dari paling atas saat membuka halaman */
(function(){
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
  function toTop(){
    const id = decodeURIComponent((location.hash || "").slice(1));
    if (id && document.getElementById(id)) return;
    window.scrollTo({top: 0, left: 0, behavior: "instant"});
  }
  toTop();
  window.addEventListener("pageshow", toTop);
  window.addEventListener("load", toTop);
})();

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const waBase = "https://wa.me/" + (DATA.wa || "");

(function(){
  const btn = $("#menuBtn"), top = $("#top");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const open = top.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  });
})();

if (DATA.wa) {
  $$(".wa-link").forEach(a => {
    a.href = waBase + "?text=" + encodeURIComponent("Halo Salon Budi Jaya, saya ingin bertanya tentang layanan Anda.");
    a.target = "_blank"; a.rel = "noopener";
  });
}
const numEl = $("#waNum");
if (numEl) {
  if (DATA.wa) numEl.textContent = ("0" + DATA.wa.replace(/^62/, "")).replace(/^(\d{4})(\d{4})(\d+)$/, "$1-$2-$3");
  else { numEl.textContent = "[Nomor WhatsApp belum diisi]"; numEl.classList.add("blank"); }
}
let filled = 0;
$$("[data-social]").forEach(a => {
  const url = DATA[a.dataset.social];
  if (url) { a.href = url; filled++; }
  else if (DATA.instagram || DATA.facebook || DATA.tiktok) { a.hidden = true; }   /* sembunyikan ikon yang belum punya tautan */
  else { a.removeAttribute("target"); a.addEventListener("click", e => e.preventDefault()); }
});
if (filled && $("#socialNote")) $("#socialNote").hidden = true;

const hasCoord = isFinite(parseFloat(DATA.lat)) && isFinite(parseFloat(DATA.lng));
if (hasCoord && $("#svLink")) $("#svLink").href = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + DATA.lat + "," + DATA.lng;
if ($("#mapsLink")) $("#mapsLink").href = DATA.maps || (hasCoord
  ? "https://www.google.com/maps/search/?api=1&query=" + DATA.lat + "," + DATA.lng
  : "https://www.google.com/maps/search/?api=1&query=Salon+Budi+Jaya+Kendari");

/* muncul halus saat digulir */
(function(){
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) return;
  try { if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; } catch (e) {}
  const vh = innerHeight;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("r-in"); e.target.classList.remove("r-wait"); io.unobserve(e.target); }
  }), {rootMargin: "0px 0px -8% 0px"});
  els.forEach(el => { if (el.getBoundingClientRect().top > vh * 0.92) { el.classList.add("r-wait"); io.observe(el); } });
  setTimeout(() => els.forEach(el => { el.classList.remove("r-wait"); }), 6000);
})();

/* animasi logo (setiap kali Beranda dibuka) */
(function(){
  const stage = $("#logoStage");
  if (!stage || !document.documentElement.classList.contains("js-anim")) return;
  $$(".logo-line path", stage).forEach(p => {
    const len = p.getTotalLength();
    const box = p.getBBox();
    const cy = box.y + box.height / 2;
    p.style.strokeDasharray = len + " " + (len + 2);
    p.style.strokeDashoffset = len;
    p.animate([{strokeDashoffset: len}, {strokeDashoffset: 0}], {
      duration: Math.min(2000, 900 + len * 1.2), delay: 100 + (cy / 668) * 900,
      easing: "cubic-bezier(.45,0,.25,1)", fill: "both"
    });
  });
  requestAnimationFrame(() => stage.classList.add("play"));
})();

/* peta OpenStreetMap */
(function(){
  const box = $("#mapbox");
  if (!box || !hasCoord) return;
  const lat = parseFloat(DATA.lat), lng = parseFloat(DATA.lng);
  const base = "https://unpkg.com/leaflet@1.9.4/dist/";
  const css = document.createElement("link");
  css.rel = "stylesheet"; css.href = base + "leaflet.css";
  document.head.appendChild(css);
  const sc = document.createElement("script");
  sc.src = base + "leaflet.js";
  sc.onload = function(){
    box.innerHTML = "";
    const map = L.map(box, {scrollWheelZoom:false}).setView([lat, lng], DATA.zoom || 17);
    const peta = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    });
    const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/";
    const satelit = L.layerGroup([
      L.tileLayer(esri + "World_Imagery/MapServer/tile/{z}/{y}/{x}", {maxZoom: 20, maxNativeZoom: 19,
        attribution: 'Citra &copy; Esri, Maxar, Earthstar Geographics'}),
      L.tileLayer(esri + "Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", {maxZoom: 20, maxNativeZoom: 19, opacity: .8}),
      L.tileLayer(esri + "Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {maxZoom: 20, maxNativeZoom: 19})
    ]);
    satelit.addTo(map);
    box.classList.add("is-sat");
    /* tombol ganti tampilan peta / satelit */
    const sw = document.createElement("div");
    sw.className = "map-switch";
    sw.innerHTML = '<button type="button" data-l="sat" aria-pressed="true">Satelit</button><button type="button" data-l="peta" aria-pressed="false">Peta</button>';
    L.DomEvent.disableClickPropagation(sw);
    box.appendChild(sw);
    sw.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const sat = b.dataset.l === "sat";
      if (sat) { map.removeLayer(peta); satelit.addTo(map); } else { map.removeLayer(satelit); peta.addTo(map); }
      box.classList.toggle("is-sat", sat);
      sw.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
    });
    const pin = L.divIcon({
      className: "", iconSize: [40, 52], iconAnchor: [20, 50], popupAnchor: [0, -46],
      html: '<svg class="pin" viewBox="0 0 40 52" aria-hidden="true"><path d="M20 1C9.5 1 2 8.6 2 18.5 2 32 20 51 20 51s18-19 18-32.5C38 8.6 30.5 1 20 1Z" fill="#080B11" stroke="#D8B46A" stroke-width="2"/><circle cx="20" cy="18.5" r="7.5" fill="#D8B46A"/></svg>'
    });
    L.marker([lat, lng], {icon: pin, title: "Salon Budi Jaya"}).addTo(map)
      .bindPopup("<b>SALON BUDI JAYA</b><br>Samping Korem 143 Haluoleo").openPopup();
    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());
  };
  document.body.appendChild(sc);
})();

(function(){
  const d = new Date().getDay();
  $$(".hours tr").forEach(tr => { if (+tr.dataset.d === d) tr.classList.add("today"); });
})();

(function(){
  const form = $("#orderForm");
  if (!form) return;
  const sel = $("#layanan-pilih");
  const key = (location.hash || "").slice(1);
  if (key) $$("option", sel).forEach(o => { if (o.dataset.k === key) sel.value = o.value; });
  const v = id => $("#" + id).value.trim();
  function msg() {
    let tgl = v("tanggal");
    if (tgl) { try { tgl = new Date(tgl + "T00:00").toLocaleDateString("id-ID", {day:"numeric", month:"long", year:"numeric"}); } catch (e) {} }
    const lines = ["Halo Salon Budi Jaya,", "", "Nama: " + (v("nama") || "-"), "Layanan: " + sel.value, "Tanggal acara: " + (tgl || "-")];
    if (v("catatan")) lines.push("Catatan: " + v("catatan"));
    lines.push("", "Mohon info ketersediaan dan harganya. Terima kasih.");
    return lines.join("\n");
  }
  const send = $("#sendWa");
  const refresh = () => { send.href = waBase + "?text=" + encodeURIComponent(msg()); };
  form.addEventListener("input", refresh);
  form.addEventListener("submit", e => e.preventDefault());
  refresh();
})();

/* ulasan */
(function(){
  const STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>';
  const COLORS = ["#E0A526","#9B4DE0","#E5532D","#2E9E6A","#2F7FD8","#C2417A","#7A8B2B","#D9772B"];
  const esc = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const stars = n => '<span class="stars" aria-label="' + n + ' dari 5 bintang">' + [1,2,3,4,5].map(i => i <= Math.round(n) ? STAR : '<span class="off">' + STAR + '</span>').join("") + "</span>";
  const mask = k => { k = String(k || ""); const m = k.match(/^([^@]{1,6})[^@]*(@.+)$/); return m ? m[1] + "···" + m[2] : k; };
  const color = n => { let h = 0; for (const ch of String(n)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return COLORS[h % COLORS.length]; };
  const date = d => { try { return d ? new Date(d + "T00:00").toLocaleDateString("id-ID", {day:"numeric", month:"long", year:"numeric"}) : ""; } catch (e) { return ""; } };
  const list = REVIEWS.filter(r => r && r.nama && r.bintang).sort((a, b) => String(b.tanggal || "").localeCompare(String(a.tanggal || "")));

  function card(r) {
    const sub = [mask(r.kontak), date(r.tanggal)].filter(Boolean).join(" · ");
    return '<article class="card rv-card"><div class="rv-top"><div class="rv-av" style="background:' + color(r.nama) + '">' + esc(String(r.nama).trim().charAt(0).toUpperCase()) +
      '</div><div class="rv-who"><b>' + esc(r.nama) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div>' + stars(r.bintang) + '</div>' +
      (r.layanan ? '<p class="rv-tag">' + esc(r.layanan) + '</p>' : '') +
      '<p class="rv-q">“' + esc(r.ulasan) + '”</p></article>';
  }
  const empty = '<div class="card rv-empty"><img class="lg" src="logo-badge.png" alt=""><h3>Belum ada ulasan</h3><p>Ulasan pelanggan akan tampil di sini. Pernah memakai layanan kami? Jadilah yang pertama memberi penilaian.</p><a class="btn btn-gold" href="ulasan.html#beri">Beri Ulasan</a></div>';

  const sum = $("#rvSummary");
  if (sum) {
    const n = list.length;
    const avg = n ? list.reduce((s, r) => s + Number(r.bintang), 0) / n : 0;
    const perfect = list.filter(r => Number(r.bintang) === 5).length;
    const bars = [5,4,3,2,1].map(k => { const c = list.filter(r => Math.round(r.bintang) === k).length; const w = n ? Math.round(c / n * 100) : 0;
      return '<div class="bar"><span>' + k + '★</span><i><b style="width:' + w + '%"></b></i><span>' + c + '</span></div>'; }).join("");
    sum.innerHTML = '<div class="rv-sum"><div class="rv-big"><span class="rv-avg">' + (n ? avg.toFixed(1).replace(".", ",") : "–") + '</span><div class="rv-meta">' + stars(avg) +
      '<span class="txt">' + (n ? 'dari <b>' + n + ' ulasan</b> pelanggan · ' + perfect + ' memberi nilai sempurna' : 'Belum ada ulasan') + '</span></div></div><div class="bars">' + bars + '</div></div>';
  }
  const box = $("#reviewList");
  if (box) box.innerHTML = list.length ? '<div class="rv-list">' + list.map(card).join("") + '</div>' : empty;
  const home = $("#homeReviews");
  if (home && list.length) {
    const lim = +home.dataset.limit || 6;
    const avg = list.reduce((s, r) => s + Number(r.bintang), 0) / list.length;
    $("#homeRvSum").innerHTML = '<div class="rv-big"><span class="rv-avg" style="font-size:3rem">' + avg.toFixed(1).replace(".", ",") + '</span><div class="rv-meta">' + stars(avg) + '<span class="txt">dari <b>' + list.length + ' ulasan</b> pelanggan</span></div></div>';
    home.innerHTML = '<div class="rv-list">' + list.slice(0, lim).map(card).join("") + '</div>';
    $("#homeRvSec").hidden = false;
    if (list.length > lim) $("#homeRvMore").hidden = false;
  }

  const form = $("#reviewForm");
  if (form) {
    const send = $("#rvSend");
    const refresh = () => {
      const b = (form.querySelector('input[name="bintang"]:checked') || {}).value || "5";
      const lines = ["Halo Salon Budi Jaya, saya ingin memberi ulasan:", "",
        "Penilaian: " + "★".repeat(+b) + "☆".repeat(5 - b) + " (" + b + "/5)",
        "Nama: " + ($("#rvNama").value.trim() || "-"),
        "Layanan: " + $("#rvLayanan").value,
        "Ulasan: " + ($("#rvTeks").value.trim() || "-"), "",
        $("#rvIzin").checked ? "Saya setuju ulasan ini ditampilkan di website." : "Ulasan ini jangan ditampilkan di website."];
      send.href = waBase + "?text=" + encodeURIComponent(lines.join("\n"));
    };
    form.addEventListener("input", refresh); form.addEventListener("change", refresh);
    form.addEventListener("submit", e => e.preventDefault());
    refresh();
  }
})();

(function(){
  const lb = $("#lightbox");
  if (!lb || !lb.showModal) return;
  $$("button.g-item").forEach(b => b.addEventListener("click", () => {
    $("img", lb).src = b.dataset.full; $("img", lb).alt = b.dataset.cap;
    $("p", lb).textContent = b.dataset.cap;
    lb.showModal();
  }));
  $("button", lb).addEventListener("click", () => lb.close());
  lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
})();
