
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
    whatsappE164: '5492641234567',
    site: 'https://lafabrica3d.ar/qr',
    address: 'Av. San Martín 123, San Juan, Argentina',
    lat: -31.5375, lng: -68.5364,
  };

  const iconsWrap = document.querySelector('.social');
  const linksWrap = document.querySelector('.links');
  [iconsWrap, linksWrap].forEach(el => el.classList.add('stagger'));

  // Utilidad: revela los hijos en cascada
  function cascadeReveal(container, step = 90, start = 0){
    const items = Array.from(container.children);
    items.forEach((item, i) => {
    // garantizamos transición de opacidad/transform
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
document.getElementById('whatsapp').href = `https://wa.me/${DATA.whatsappE164}?text=${encodeURIComponent('¡Hola! Vengo de la tarjeta QR y quiero cotizar un trabajo en 3D.')}`;

  // Redes
  document.getElementById('instagram').href = `https://instagram.com/${DATA.instagram}`;
  document.getElementById('tiktok').href = `https://www.tiktok.com/@${DATA.tiktok}`;
  document.getElementById('youtube').href = DATA.youtube;
  document.getElementById('twitter').href = DATA.twitter;
  document.getElementById('facebook').href = DATA.facebook;

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
    try { if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(DATA.site); alert('Enlace copiado ✔'); } } catch(e){}
  });

  // Descripción: efecto typewriter + fade-in
  (function runDescription(){
  const el = document.getElementById('desc');
  const txt = DATA.description;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  requestAnimationFrame(() => el.classList.add('reveal'));

  // Accesibilidad: sin animaciones -> mostramos todo de una
  if (reduce){
    el.textContent = txt;
    cascadeReveal(iconsWrap, 0, 0);
    cascadeReveal(linksWrap, 0, 0);
    return;
  }

  // Typewriter con leve jitter
  el.textContent = '';
  const cur = document.createElement('span');
  cur.className = 'cursor';
  cur.setAttribute('aria-hidden','true');
  el.appendChild(cur);

  let i = 0;
  const base = 22; // ms

  function type() {
    if (i < txt.length) {
      cur.insertAdjacentText('beforebegin', txt[i++]);
      setTimeout(type, base + Math.random()*40);
    } else {
      cur.remove();

      // --- cuando termina de escribir, revelamos en cascada:
      // primero iconos, luego botones con un poco más de delay
      const ICON_STEP = 80;
      const LINKS_STEP = 90;

      cascadeReveal(iconsWrap, ICON_STEP, 120);
      // esperamos a que arranquen los iconos y encadenamos los botones
      const afterIcons = 120 + iconsWrap.children.length * ICON_STEP + 150;
      cascadeReveal(linksWrap, LINKS_STEP, afterIcons);
    }
  }
  setTimeout(type, 220); // pequeño delay tras el fade
})();

  // ==== Efecto de botones: scale (mobile) ====
  const addTapFX = (el) => {
    el.addEventListener('pointerdown', () => el.classList.add('pressed'));
    el.addEventListener('pointerup', () => { el.classList.remove('pressed'); el.classList.add('pop'); setTimeout(()=>el.classList.remove('pop'), 220); });
    el.addEventListener('pointerleave', () => el.classList.remove('pressed'));
    el.addEventListener('pointercancel', () => el.classList.remove('pressed'));
  };
  document.querySelectorAll('.link, .social a, .fab').forEach(addTapFX);

  // ==== Bloquear Catálogo y Tienda ====
  function disableLink(el){
    el.classList.add('is-disabled');
    el.setAttribute('aria-disabled', 'true');
    el.addEventListener('click', (e) => {
      e.preventDefault();
      // aviso simple; si querés, lo cambio por un toast lindo
      alert('Próximamente');
    }, { passive:false });
  }
  const lCatalogo = document.getElementById('catalogo');
  const lTienda   = document.getElementById('tienda');
  // Dejamos sus href por si luego los activás:
  lCatalogo.href = DATA.catalogo;
  lTienda.href   = DATA.tienda;
  disableLink(lCatalogo);
  disableLink(lTienda);
