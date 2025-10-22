const DATA = {
  name: 'La Fábrica 3D',
  role: 'IMPRESIÓN 3D',
  description: 'Diseñamos y fabricamos piezas a medida con impresión 3D: prototipos, repuestos, regalos personalizados y más. Envíos a todo el país.',
  instagram: 'lafabrica3d', tiktok: 'lafabrica3d',
  youtube: 'https://youtube.com/@lafabrica3d',
  twitter: 'https://twitter.com/lafabrica3d',
  facebook: 'https://facebook.com/lafabrica3d',
  catalogo: 'https://lafabrica3d.ar/catalogo',
  tienda: 'https://lafabrica3d.ar/tienda',
  presupuesto: 'mailto:hola@lafabrica3d.ar?subject=Pedir%20presupuesto%20Impresi%C3%B3n%203D',
  whatsappE164: '5492645462279',
  site: 'https://lafabrica3d.ar/qr',
  address: 'Av. San Martín 123, San Juan, Argentina',
  lat: -31.5375, lng: -68.5364,
};

// Marcar elementos que entran al cargar
const cover  = document.querySelector('.cover');
const avatar = document.querySelector('.avatar');
const title  = document.querySelector('h1');
const roleEl = document.querySelector('.role');
[cover, avatar, title, roleEl].forEach(el => el && el.classList.add('will-reveal'));

// Contenedores para cascada (iconos y links)
const iconsWrap = document.querySelector('.social');
const linksWrap = document.querySelector('.links');
[iconsWrap, linksWrap].forEach(el => el && el.classList.add('stagger'));

// Helpers de animación
function reveal(el, delay=0){
  if(!el) return;
  setTimeout(()=> el.classList.add('show'), delay);
}

function cascadeReveal(container, step = 90, start = 0){
  if(!container) return;
  const items = Array.from(container.children);
  items.forEach((item, i) => {
    item.style.transition = (item.style.transition ? item.style.transition + ',' : '') +
                            ' opacity .45s ease, transform .45s ease';
    item.style.transitionDelay = `${start + i*step}ms`;
  });
  container.classList.add('show');

  // limpieza del delay para no afectar interacciones futuras
  const total = start + items.length * step + 600;
  setTimeout(() => items.forEach(it => it.style.transitionDelay = ''), total);
}

// Completar textos / enlaces
document.querySelector('h1').textContent = DATA.name;
document.querySelector('.role').textContent = DATA.role;
document.getElementById('presupuesto').href = DATA.presupuesto;
document.getElementById('whatsapp').href =
  `https://wa.me/${DATA.whatsappE164}?text=${encodeURIComponent('¡Hola! Vengo de la tarjeta QR y quiero cotizar un trabajo en 3D.')}`;

// Redes
document.getElementById('instagram').href = `https://instagram.com/${DATA.instagram}`;
document.getElementById('tiktok').href    = `https://www.tiktok.com/@${DATA.tiktok}`;
document.getElementById('youtube').href   = DATA.youtube;
document.getElementById('twitter').href   = DATA.twitter;
document.getElementById('facebook').href  = DATA.facebook;

// Maps
function mapsDirectionsLink({address, lat, lng}) {
  const dest = (Number.isFinite(lat) && Number.isFinite(lng)) ? `${lat},${lng}` : encodeURIComponent(address || '');
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
}
document.getElementById('ubicacion').href = mapsDirectionsLink(DATA);

// Año
document.getElementById('year').textContent = new Date().getFullYear();

// Compartir
document.getElementById('shareBtn').addEventListener('click', async () => {
  const shareData = { title: `${DATA.name} — Contacto`, text: 'Impresión 3D y prototipado rápido', url: DATA.site };
  try {
    if (navigator.share) await navigator.share(shareData);
    else { await navigator.clipboard.writeText(DATA.site); alert('Enlace copiado ✔'); }
  } catch(e){}
});

// Lanzamos la entrada inicial coordinada
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion){
  [cover, avatar, title, roleEl].forEach(el => el && el.classList.add('show'));
} else {
  requestAnimationFrame(() => {
    reveal(cover,   60);   // portada
    reveal(avatar, 160);   // logo
    reveal(title,  280);   // h1
    reveal(roleEl, 360);   // subtítulo
  });
}


/* Descripción: entra DESPUÉS de cover/avatar/título/role con fade-in único */
(function runDescription(){
  const el  = document.getElementById('desc');
  if(!el) return;

  const txt = DATA.description;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ponemos el texto directo (preserva espacios correctamente)
  el.textContent = txt;

  // Orden: cover(60) → avatar(160) → h1(280) → role(360) → desc(...)
  const DESC_START_MS = 620; // Ajustá (520–700 ms) según te guste el ritmo

  if (reduce){
    // Sin animaciones
    el.classList.add('show');
    cascadeReveal(iconsWrap, 0, 0);
    cascadeReveal(linksWrap, 0, 0);
    return;
  }

  // Mostramos la descripción después del resto
  setTimeout(() => {
    el.classList.add('show');

    // Lanza la cascada de iconos y luego botones, un toque después del fade
    const ICON_STEP  = 80;
    const LINKS_STEP = 90;
    setTimeout(() => {
      cascadeReveal(iconsWrap, ICON_STEP, 120);
      const afterIcons = 120 + (iconsWrap?.children.length || 0) * ICON_STEP + 150;
      cascadeReveal(linksWrap, LINKS_STEP, afterIcons);
    }, 480); // espera a que termine el fade
  }, DESC_START_MS);
})();



// ==== Efecto de botones: scale (mobile) ====
const addTapFX = (el) => {
  el.addEventListener('pointerdown', () => el.classList.add('pressed'));
  el.addEventListener('pointerup', () => {
    el.classList.remove('pressed');
    el.classList.add('pop');
    setTimeout(()=>el.classList.remove('pop'), 220);
  });
  el.addEventListener('pointerleave', () => el.classList.remove('pressed'));
  el.addEventListener('pointercancel', () => el.classList.remove('pressed'));
};
document.querySelectorAll('.link, .social a, .fab').forEach(addTapFX);

// ==== Bloquear Catálogo y Tienda (dejando href por si luego los activás) ====
function disableLink(el){
  if(!el) return;
  el.classList.add('is-disabled');
  el.setAttribute('aria-disabled', 'true');
  el.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Próximamente');
  }, { passive:false });
}
const lCatalogo = document.getElementById('catalogo');
const lTienda   = document.getElementById('tienda');
if (lCatalogo) lCatalogo.href = DATA.catalogo;
if (lTienda)   lTienda.href   = DATA.tienda;
disableLink(lCatalogo);
disableLink(lTienda);
