/* =========================================================
   ISI DATA SALON DI SINI (berlaku untuk semua halaman)
   ========================================================= */
const DATA = {
  wa: "6282255871937", // 0822-5587-1937; contoh: "6281234567890" (pakai 62, tanpa + dan tanpa 0 di depan)
  instagram: "https://www.instagram.com/budi_jaya.gallery/", // contoh: "https://instagram.com/namaakun"
  facebook: "",
  tiktok: "https://www.tiktok.com/@budijaya.122",
  maps: "",        // tautan pin Google Maps (boleh kosong, otomatis pakai koordinat)
  lat: "-3.965472",
  lng: "122.519148",
  zoom: 17
};
/* ========================================================= */

/* =========================================================
   TANGGAL YANG SUDAH PENUH (format "TAHUN-BULAN-TANGGAL")
   Tanggal yang sudah lewat otomatis tidak ditampilkan.
   Contoh: const TANGGAL_PENUH = ["2026-11-14", "2026-11-21"];
   ========================================================= */
const TANGGAL_PENUH = [];

/* Tautan CSV Google Sheets "Tanggal Penuh - Salon Budi Jaya"
   (File > Bagikan > Publikasikan ke web > lembar "Tanggal Penuh" > CSV).
   Jika diisi, tanggal di sheet itu otomatis tampil di website. */
const SHEET_TANGGAL_PENUH = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTX_QEqFFZHGEkBq-F96vHGd3dq6kDWlNdyVsTR2O69wM_ZgqSWmsHazAN7q9Vw6nKQWWjiLuWFPyu/pub?gid=0&single=true&output=csv";

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
  else if (a.dataset.always) { a.removeAttribute("target"); a.title = "TikTok segera hadir"; a.addEventListener("click", e => e.preventDefault()); }
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

/* tanggal penuh (dari daftar di atas + Google Sheets) */
(function(){
  const box = $("#fullDates"), inp = $("#tanggal"), warn = $("#dateWarn");
  if (!box && !inp) return;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const pad = n => String(n).padStart(2, "0");
  const iso = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const t0 = iso(today);
  const BULAN = {jan:1,januari:1,january:1,feb:2,februari:2,february:2,mar:3,maret:3,march:3,apr:4,april:4,mei:5,may:5,jun:6,juni:6,june:6,jul:7,juli:7,july:7,agu:8,agt:8,agustus:8,aug:8,august:8,sep:9,sept:9,september:9,okt:10,oktober:10,oct:10,october:10,nov:11,november:11,des:12,desember:12,dec:12,december:12};
  function parse(v) {
    v = String(v || "").trim().replace(/^"|"$/g, "");
    let m;
    if ((m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return m[1] + "-" + pad(m[2]) + "-" + pad(m[3]);
    if ((m = v.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/))) return m[3] + "-" + pad(m[2]) + "-" + pad(m[1]);
    if ((m = v.match(/^(?:[a-z]+,?\s+)?(\d{1,2})\s+([a-z]+)\.?\s+(\d{4})$/i)) && BULAN[m[2].toLowerCase()]) return m[3] + "-" + pad(BULAN[m[2].toLowerCase()]) + "-" + pad(m[1]);
    return "";
  }
  let list = [];
  function render() {
    list = [...new Set(list)].filter(d => d >= t0).sort();
    if (box) {
      box.innerHTML = list.map(d => '<span>' + new Date(d + "T00:00").toLocaleDateString("id-ID", {weekday:"short", day:"numeric", month:"short", year:"numeric"}) + '</span>').join("");
      $("#fullBox").hidden = !list.length;
    }
    if (inp && warn) warn.hidden = !list.includes(inp.value);
  }
  if (inp && warn) { inp.min = t0; inp.addEventListener("input", render); }
  list = TANGGAL_PENUH.map(parse).filter(Boolean);
  render();
  if (SHEET_TANGGAL_PENUH) {
    fetch(SHEET_TANGGAL_PENUH + (SHEET_TANGGAL_PENUH.includes("?") ? "&" : "?") + "t=" + Date.now())
      .then(r => r.ok ? r.text() : "")
      .then(txt => {
        txt.split(/\r?\n/).forEach(line => { const m = line.match(/^\s*"([^"]*)"|^([^,]*)/); const d = parse(m ? (m[1] ?? m[2]) : ""); if (d) list.push(d); });
        render();
      })
      .catch(() => {});
  }
})();

/* ulasan */
(function(){
  const STAR = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>';
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
  const im = $("img", lb), vd = $("video", lb), cap = $("p", lb), cnt = $(".lb-count", lb);
  const items = $$("button.g-item");
  let cur = 0;
  function show(i) {
    cur = (i + items.length) % items.length;
    const b = items[cur];
    if (b.dataset.video) {
      im.hidden = true; vd.hidden = false; vd.src = b.dataset.video; vd.play().catch(() => {});
    } else {
      vd.hidden = true; vd.pause(); vd.removeAttribute("src");
      im.hidden = false; im.classList.remove("in"); im.src = b.dataset.full; im.alt = b.dataset.cap;
      requestAnimationFrame(() => im.classList.add("in"));
    }
    cap.textContent = b.dataset.cap;
    cnt.textContent = (cur + 1) + " / " + items.length;
  }
  items.forEach((b, i) => b.addEventListener("click", () => { show(i); lb.showModal(); }));
  lb.addEventListener("close", () => { vd.pause(); });
  $(".lb-x", lb).addEventListener("click", () => lb.close());
  $(".lb-prev", lb).addEventListener("click", () => show(cur - 1));
  $(".lb-next", lb).addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });
  let x0 = null;
  lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, {passive: true});
  lb.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  });
})();

/* arch photo rotation + living cards */
(function(){
  let still = false;
  try { still = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  if (!still) {
    $$(".arch-pics").forEach((box, k) => {
      const pics = Array.from(box.children);
      if (pics.length < 2) return;
      let i = 0;
      setTimeout(() => setInterval(() => {
        if (document.hidden) return;
        pics[i].classList.remove("on");
        i = (i + 1) % pics.length;
        pics[i].classList.add("on");
      }, 5200), 1200 + k * 1700);
    });
  }
  $$(".card").forEach(c => c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (e.clientX - r.left) + "px");
    c.style.setProperty("--my", (e.clientY - r.top) + "px");
  }));
})();
