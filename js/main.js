/* =============================================
   YANALABS — main.js
   ============================================= */

/* --- NAVBAR: Scroll shadow + Hamburger Menu -------------- */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  hamburger && hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  mobileClose && mobileClose.addEventListener('click', closeMobile);
  mobileMenu && mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeMobile();
  });

  function closeMobile() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
})();

/* --- ACCORDION FAQ --------------------------------------- */
(function initAccordion() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* --- SCROLL REVEAL ---------------------------------------- */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .step-card');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger step cards
        const card = entry.target;
        const delay = card.dataset.delay || 0;
        setTimeout(() => card.classList.add('visible'), delay);
        io.unobserve(card);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
})();

/* --- STAGGER STEP CARDS ----------------------------------- */
document.querySelectorAll('.step-card').forEach((card, i) => {
  card.dataset.delay = i * 80;
});

/* --- CONTACT FORM (demo handler) -------------------------- */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Envoyé ✅';
    btn.style.background = 'linear-gradient(136deg, #6dd5a8, #2fa876)';
    setTimeout(() => {
      btn.textContent = 'Envoyer';
      btn.style.background = '';
      form.reset();
    }, 3500);
  });
})();

/* --- NEWSLETTER FORM -------------------------------------- */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.newsletter-submit');
    btn.textContent = 'Inscrit ✅';
    setTimeout(() => { btn.innerHTML = 'Je m\'inscrit <span class="newsletter-arrow">→</span>'; form.reset(); }, 3000);
  });
})();

/* --- SMOOTH SCROLL for anchors --------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
/* --- GSAP WORKFLOW SCROLL ANIMATION ----------------------- */
(function initWorkflowAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const steps = document.querySelectorAll(
    '.workflow-diagram .wf-node, .workflow-diagram .wf-connector-v, .workflow-diagram .wf-node-non'
  );
  if (!steps.length) return;

  gsap.set(steps, { opacity: 0, y: 20 });

  const tl = gsap.timeline({ paused: true });

  steps.forEach((el) => {
    tl.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: 'power2.out',
    }, '+=0.1');
  });

  ScrollTrigger.create({
    trigger: '.workflow-diagram',
    start: 'top 70%',
    onEnter:      () => tl.restart(),
    onEnterBack:  () => tl.restart(),
    onLeave:      () => tl.progress(0).pause(),
    onLeaveBack:  () => tl.progress(0).pause(),
  });
})();