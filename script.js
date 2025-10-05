/* ===== Carrusel Physy — versión robusta por scroll ===== */
document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.querySelector('.lc-viewport');
  const track    = document.querySelector('.lc-track');
  if (!viewport || !track) return;

  const slides  = Array.from(track.children);
  const prevBtn = document.querySelector('.lc-prev');
  const nextBtn = document.querySelector('.lc-next');
  const dotsBox = document.querySelector('.lc-dots');

  let index = 0;
  let autoTimer = null;
  const AUTO_MS = 4500;

  // Construye dots
  function buildDots() {
    dotsBox.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Ir a la diapositiva ${i+1}`);
      b.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(b);
    });
    updateDots();
  }

  function updateDots() {
    const dots = Array.from(dotsBox.children);
    dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
  }

  // Ir a slide i por scroll horizontal
  function goTo(i, smooth = true) {
    index = (i + slides.length) % slides.length;
    const x = index * viewport.clientWidth;
    track.scrollTo({ left: x, behavior: smooth ? 'smooth' : 'instant' });
    updateDots();
  }

  // Mantener index en scroll manual o por redimensionado
  function syncIndexFromScroll() {
    const i = Math.round(track.scrollLeft / viewport.clientWidth);
    if (i !== index) { index = i; updateDots(); }
  }

  // Auto avance
  function startAuto(){ stopAuto(); autoTimer = setInterval(() => goTo(index+1), AUTO_MS); }
  function stopAuto(){ if (autoTimer) clearInterval(autoTimer); autoTimer = null; }

  // Eventos UI
  nextBtn?.addEventListener('click', () => goTo(index+1));
  prevBtn?.addEventListener('click', () => goTo(index-1));

  // Pausa al pasar el mouse / reanuda al salir
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  // Mantener index al hacer scroll manual
  track.addEventListener('scroll', () => {
    // Debounce muy ligero sin timers: solo cuando termina el scroll
    window.requestAnimationFrame(syncIndexFromScroll);
  });

  // Recalcular posición en resize
  window.addEventListener('resize', () => goTo(index, false));

  // Teclado (cuando el puntero está encima del carrusel)
  let over = false;
  viewport.addEventListener('mouseenter', () => { over = true; });
  viewport.addEventListener('mouseleave', () => { over = false; });
  window.addEventListener('keydown', (e) => {
    if (!over) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index+1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(index-1); }
  });

  // Init
  buildDots();
  goTo(0, false);
  startAuto();
});


/* ===== Código bloque de actividad===== */

// Alterna mostrar/ocultar la solución para cada ejercicio (sin IDs fijos)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-solution").forEach(btn => {
    btn.addEventListener("click", () => {
      const solution = btn.nextElementSibling; // div.solution-box asociado
      const isHidden = solution.hasAttribute("hidden");

      
      if (solution.hasAttribute("hidden")) {
        solution.removeAttribute("hidden");
        requestAnimationFrame(() => solution.classList.add("is-open"));
        btn.textContent = "Ocultar solución";
        btn.setAttribute("aria-expanded", "true");
      } else {
        solution.classList.remove("is-open");
        solution.addEventListener("transitionend", () => {
          solution.setAttribute("hidden", "");
        }, { once: true });
        btn.textContent = "Mostrar solución";
        btn.setAttribute("aria-expanded", "false");
      }

    });
  });
});

/* ===== Desbloqueo de tesoros ===== */
document.addEventListener("DOMContentLoaded", function() {
  // Solo ejecutar si estamos en la página bitácora
  if (window.location.pathname.includes("bitacora.html")) {
    for (let i = 1; i <= 6; i++) {
      if (localStorage.getItem(`item${i}`) === 'true') {
        const el = document.getElementById(`item${i}`);
        if (el) el.style.display = 'block';
      }
    }
  }
});
