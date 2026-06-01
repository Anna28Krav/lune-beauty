window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.preloader')?.classList.add('hide'), 900);
});

const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menuBtn?.addEventListener('click', () => nav.classList.toggle('open'));

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => nav?.classList.remove('open'));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function showToast(text) {
  const toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.reset();
    showToast('Дякуємо! Заявку прийнято. Ми скоро зв’яжемося з вами.');
  });
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();


// ===== FINAL LUNÉ BEAUTY INTERACTIONS =====
const menuIcon = document.querySelector('.menu-btn');
menuIcon?.addEventListener('click', () => menuIcon.classList.toggle('open'));

const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.classList.add('visible');
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  window.addEventListener('mouseleave', () => glow.classList.remove('visible'));
}

const slides = document.querySelectorAll('.hero-slide');
let slideIndex = 0;
if (slides.length) {
  setInterval(() => {
    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
  }, 4200);
}

const track = document.querySelector('.reviews-track');
const nextBtn = document.querySelector('.slider-btn.next');
const prevBtn = document.querySelector('.slider-btn.prev');
function slideReviews(dir = 1) {
  if (!track) return;
  const card = track.querySelector('.review-card');
  if (!card) return;
  const step = card.getBoundingClientRect().width + 28;
  const max = track.scrollWidth - track.clientWidth - 5;
  if (dir > 0 && track.scrollLeft >= max) track.scrollTo({ left: 0, behavior: 'smooth' });
  else if (dir < 0 && track.scrollLeft <= 5) track.scrollTo({ left: max, behavior: 'smooth' });
  else track.scrollBy({ left: step * dir, behavior: 'smooth' });
}
nextBtn?.addEventListener('click', () => slideReviews(1));
prevBtn?.addEventListener('click', () => slideReviews(-1));
if (track) setInterval(() => slideReviews(1), 6500);

// ===== ABOUT PAGE V10: masters carousel and works gallery =====
const masterTrack = document.querySelector('.masters-wrap .masters-track');
const masterNext = document.querySelector('.master-next');
const masterPrev = document.querySelector('.master-prev');
function slideMasters(dir = 1){
  if(!masterTrack) return;
  const card = masterTrack.querySelector('.master-card');
  if(!card) return;
  const gap = 22;
  const step = card.getBoundingClientRect().width + gap;
  const max = masterTrack.scrollWidth - masterTrack.clientWidth - 5;
  if(dir > 0 && masterTrack.scrollLeft >= max) masterTrack.scrollTo({left:0, behavior:'smooth'});
  else if(dir < 0 && masterTrack.scrollLeft <= 5) masterTrack.scrollTo({left:max, behavior:'smooth'});
  else masterTrack.scrollBy({left:step * dir, behavior:'smooth'});
}
masterNext?.addEventListener('click', () => slideMasters(1));
masterPrev?.addEventListener('click', () => slideMasters(-1));

document.querySelectorAll('.master-bottom button').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.stopPropagation();
    const card = btn.closest('.master-card');
    document.querySelectorAll('.master-card.active').forEach(item=>{ if(item !== card) item.classList.remove('active'); });
    card?.classList.toggle('active');
  });
});
document.addEventListener('click', (e)=>{
  if(!e.target.closest('.master-card')) document.querySelectorAll('.master-card.active').forEach(card=>card.classList.remove('active'));
});



// ===== ABOUT PAGE V13: open works as one beautiful gallery under the masters row =====
const globalGallery = document.querySelector('.master-global-gallery');
const globalFilm = document.querySelector('.master-global-film');
const galleryClose = document.querySelector('.gallery-close');
const galleryLeft = document.querySelector('.gallery-left');
const galleryRight = document.querySelector('.gallery-right');
let openedMasterCard = null;

function closeMasterGallery(){
  if(!globalGallery || !globalFilm) return;
  globalGallery.classList.remove('open');
  globalGallery.setAttribute('aria-hidden','true');
  globalFilm.innerHTML = '';
  document.querySelectorAll('.master-card.active').forEach(card=>card.classList.remove('active'));
  openedMasterCard = null;
}

function openMasterGallery(card){
  if(!globalGallery || !globalFilm || !card) return;
  if(openedMasterCard === card && globalGallery.classList.contains('open')){
    closeMasterGallery();
    return;
  }
  document.querySelectorAll('.master-card.active').forEach(item=>item.classList.remove('active'));
  card.classList.add('active');
  openedMasterCard = card;
  const imgs = [...card.querySelectorAll('.works-popup img')];
  globalFilm.innerHTML = imgs.map(img => `<img src="${img.src}" alt="${img.alt || 'Робота майстра'}">`).join('');
  globalGallery.classList.add('open');
  globalGallery.setAttribute('aria-hidden','false');
  globalFilm.scrollTo({left:0, behavior:'auto'});
}

// Перепідключаємо кнопки робіт так, щоб галерея відкривалась знизу, а не всередині картки.
document.querySelectorAll('.master-bottom button').forEach(btn=>{
  const fresh = btn.cloneNode(true);
  btn.replaceWith(fresh);
  fresh.addEventListener('click', (e)=>{
    e.stopPropagation();
    openMasterGallery(fresh.closest('.master-card'));
  });
});
galleryClose?.addEventListener('click', closeMasterGallery);
galleryLeft?.addEventListener('click', (e)=>{e.stopPropagation(); globalFilm?.scrollBy({left:-520, behavior:'smooth'});});
galleryRight?.addEventListener('click', (e)=>{e.stopPropagation(); globalFilm?.scrollBy({left:520, behavior:'smooth'});});

globalGallery?.addEventListener('click', e => e.stopPropagation());

// ===== ABOUT PAGE V14: autoplay carousel for opened master works =====
let masterWorksAutoTimer = null;
function startMasterWorksAutoplay(){
  if(masterWorksAutoTimer) clearInterval(masterWorksAutoTimer);
  masterWorksAutoTimer = setInterval(()=>{
    const gallery = document.querySelector('.master-global-gallery.open');
    const film = document.querySelector('.master-global-film');
    if(!gallery || !film || !film.children.length) return;
    const max = film.scrollWidth - film.clientWidth - 4;
    if(max <= 0) return;
    if(film.scrollLeft >= max){
      film.scrollTo({left:0, behavior:'smooth'});
    }else{
      film.scrollBy({left:170, behavior:'smooth'});
    }
  }, 2200);
}

// Підсилюємо вже наявні кнопки: після відкриття галереї запускається автолистання.
document.querySelectorAll('.master-bottom button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    setTimeout(startMasterWorksAutoplay, 250);
  });
});

document.querySelector('.gallery-close')?.addEventListener('click', ()=>{
  if(masterWorksAutoTimer) clearInterval(masterWorksAutoTimer);
});

// Пауза при наведенні, щоб можна було спокійно роздивитись роботи.
const aboutWorksFilm = document.querySelector('.master-global-film');
aboutWorksFilm?.addEventListener('mouseenter', ()=>{ if(masterWorksAutoTimer) clearInterval(masterWorksAutoTimer); });
aboutWorksFilm?.addEventListener('mouseleave', startMasterWorksAutoplay);


// ===== v35 Luné Beauty real interactive map =====
document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('luneLeafletMap');
  if (!mapEl || typeof L === 'undefined') return;

  const luneCoords = [49.588267, 34.551417]; // м. Полтава, вул. Європейська, 15

  const map = L.map(mapEl, {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView(luneCoords, 17);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  const luneIcon = L.divIcon({
    className: 'lune-leaflet-marker',
    html: '<div class="lune-marker-pin"><img src="images/logo.svg" alt="Luné Beauty"></div>',
    iconSize: [94, 94],
    iconAnchor: [47, 94],
    popupAnchor: [0, -88]
  });

  L.marker(luneCoords, { icon: luneIcon })
    .addTo(map)
    .bindPopup('<b>Luné Beauty</b><br>м. Полтава, вул. Європейська, 15<br><a href="https://www.google.com/maps/search/?api=1&query=Полтава%20вул.%20Європейська%2015" target="_blank">Відкрити маршрут</a>')
    .openPopup();
});
