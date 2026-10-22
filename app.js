/* =========================================================
   ISI DATA SALON DI SINI (berlaku untuk semua halaman)
   ========================================================= */
const DATA = {
  wa: "",          // contoh: "6281234567890" (pakai 62, tanpa + dan tanpa 0 di depan)
  instagram: "",   // contoh: "https://instagram.com/namaakun"
  facebook: "",
  tiktok: "",
  maps: "",        // tautan pin Google Maps (boleh kosong, otomatis pakai koordinat)
  lat: "-3.965472",
  lng: "122.519148",
  zoom: 17
};
/* ========================================================= */

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
  if (DATA.wa) numEl.textContent = "+" + DATA.wa;
  else { numEl.textContent = "[Nomor WhatsApp belum diisi]"; numEl.classList.add("blank"); }
}
let filled = 0;
$$("[data-social]").forEach(a => {
  const url = DATA[a.dataset.social];
  if (url) { a.href = url; filled++; }
  else { a.removeAttribute("target"); a.addEventListener("click", e => e.preventDefault()); }
});
if (filled && $("#socialNote")) $("#socialNote").hidden = true;

const hasCoord = isFinite(parseFloat(DATA.lat)) && isFinite(parseFloat(DATA.lng));
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
      duration: Math.min(2000, 900 + len * 1.2), delay: 100 + (cy / 649) * 900,
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
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(map);
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
