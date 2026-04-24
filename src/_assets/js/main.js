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

/* --- FORMULAIRE CONTACT ---------------------------------- */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  /* ── Helpers ── */
  function showError(input, className, message) {
    input.style.border = '1.5px solid #ef4444';
    let err = form.querySelector('.' + className);
    if (!err) {
      err = document.createElement('p');
      err.className = className;
      err.style.cssText = 'color:#ef4444;font-size:12px;margin-top:4px;';
      input.parentElement.appendChild(err);
    }
    err.textContent = message;
  }

  function clearError(input, className) {
    input.style.border = '';
    const err = form.querySelector('.' + className);
    if (err) err.remove();
  }

  /* ── Nettoyage en temps réel ── */
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      clearError(field, field.name + '-error');
    });
  });

  /* ── Soumission ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let hasError = false;

    /* 1. Nom */
    const nom = form.querySelector('#nom');
    if (!nom.value.trim()) {
      showError(nom, 'nom-error', '⚠️ Le nom est obligatoire.');
      hasError = true;
    } else {
      clearError(nom, 'nom-error');
    }

    /* 2. Prénom */
    const prenom = form.querySelector('#prenom');
    if (!prenom.value.trim()) {
      showError(prenom, 'prenom-error', '⚠️ Le prénom est obligatoire.');
      hasError = true;
    } else {
      clearError(prenom, 'prenom-error');
    }

    /* 3. Email */
    const email = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError(email, 'email-error', '⚠️ L\'email est obligatoire.');
      hasError = true;
    } else if (!emailRegex.test(email.value.trim())) {
      showError(email, 'email-error', '⚠️ Veuillez saisir un email valide.');
      hasError = true;
    } else {
      clearError(email, 'email-error');
    }

   /* 4. Téléphone */
    const phone = form.querySelector('#phone');
    if (!phone.value.trim()) {
      showError(phone, 'phone-error', '⚠️ Le numéro de téléphone est obligatoire.');
      hasError = true;
    } else {
      clearError(phone, 'phone-error');
      // Formater le numéro avec +33 avant envoi
      const cleaned = phone.value.trim().replace(/\s/g, '').replace(/^0/, '');
      phone.value = '+33' + cleaned;
    }

    /* 5. Entreprise */
    const entreprise = form.querySelector('#entreprise');
    if (!entreprise.value.trim()) {
      showError(entreprise, 'entreprise-error', '⚠️ Le nom de l\'entreprise est obligatoire.');
      hasError = true;
    } else {
      clearError(entreprise, 'entreprise-error');
    }

    /* 6. Besoin */
    const besoin = form.querySelector('#besoin');
    if (!besoin.value.trim()) {
      showError(besoin, 'besoin-error', '⚠️ Veuillez décrire votre besoin.');
      hasError = true;
    } else {
      clearError(besoin, 'besoin-error');
    }

    /* ── Bloquer si erreur ── */
    if (hasError) return;

    /* ── Envoi webhook ── */
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('https://hook.eu1.make.com/dbsob3hxaxff8flhljj66mk977oitkrg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      // ✅ FIX : vérifier aussi les erreurs HTTP (4xx / 5xx)
      if (!res.ok) throw new Error('HTTP ' + res.status);
      btn.textContent = 'Envoyé ✅';
      btn.disabled = false; // ✅ FIX : réactiver le bouton après succès
      form.reset();
    } catch (err) {
      btn.textContent = 'Erreur, réessayez ❌';
      btn.disabled = false;
    }
  });
})();

/* --- NEWSLETTER ------------------------------------------ */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  // ✅ FIX : fallback sur [type="submit"] si .newsletter-submit est absent du HTML
  const btn        = form.querySelector('.newsletter-submit') || form.querySelector('[type="submit"]') || form.querySelector('button');
  // ✅ FIX : le champ s'appelle "newsletter-email" dans le HTML (pas "email")
  const emailInput = form.querySelector('input[name="newsletter-email"]') || form.querySelector('input[type="email"]');
  const gdpr       = document.getElementById('gdpr');

  if (!btn || !emailInput || !gdpr) {
    console.warn('[Newsletter] Élément manquant dans le formulaire :', { btn, emailInput, gdpr });
    return;
  }

  /* ── Helpers : afficher / cacher erreur ── */
  function showError(element, className, message) {
    element.style.border = '1.5px solid #ef4444';
    element.style.accentColor = '#ef4444';
    let err = form.querySelector('.' + className);
    if (!err) {
      err = document.createElement('p');
      err.className = className;
      err.style.cssText = 'color:#ef4444;font-size:12px;margin-top:6px;';
      element.parentElement.insertAdjacentElement('afterend', err);
    }
    err.textContent = message;
  }

  function clearError(element, className) {
    element.style.border = '';
    element.style.accentColor = '';
    const err = form.querySelector('.' + className);
    if (err) err.remove();
  }

  /* ── Nettoyage en temps réel ── */
  emailInput.addEventListener('input', () => clearError(emailInput, 'email-error'));
  gdpr.addEventListener('change',      () => clearError(gdpr,       'gdpr-error'));

  /* ── Soumission ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let hasError = false;

    /* 1. Vérification email */
    const emailVal   = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailVal) {
      showError(emailInput, 'email-error', '⚠️ L\'adresse email est obligatoire.');
      hasError = true;
    } else if (!emailRegex.test(emailVal)) {
      showError(emailInput, 'email-error', '⚠️ Veuillez saisir une adresse email valide.');
      hasError = true;
    } else {
      clearError(emailInput, 'email-error');
    }

    /* 2. Vérification RGPD */
    if (!gdpr.checked) {
      showError(gdpr, 'gdpr-error', '⚠️ Veuillez accepter les conditions pour continuer.');
      hasError = true;
    } else {
      clearError(gdpr, 'gdpr-error');
    }

    /* 3. Bloquer si erreur */
    if (hasError) return;

    /* 4. Envoi webhook */
    btn.textContent = 'Envoi en cours...';
    btn.disabled    = true;

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('https://hook.eu1.make.com/9uem47pfvdxfiu72q7vxq4t9yn1eotxj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      // ✅ FIX : vérifier aussi les erreurs HTTP (4xx / 5xx)
      if (!res.ok) throw new Error('HTTP ' + res.status);
      btn.textContent = 'Inscrit ✅';
      btn.disabled    = false; // ✅ FIX : réactiver le bouton après succès
      form.reset();
    } catch (err) {
      btn.textContent = 'Erreur, réessayez ❌';
      btn.disabled    = false;
    }
  });
})();

/* --- SMOOTH SCROLL for anchors --------------------------- */
document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');

    // Liens type /#section
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '#');
      const target = document.querySelector(id);
      // Si on est sur la page d'accueil et que la cible existe
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Sinon laisser naviguer normalement vers /#section
      return;
    }

    // Liens type #section
    if (href === '#') return;
    const target = document.querySelector(href);
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

  /* --- CAS D'USAGE — variable on/off ----------------------- */
  const SHOW_CAS_USAGE = false; /* ← true = visible / false = caché */

  const casUsageSection = document.getElementById('cas-usage');
  if (casUsageSection) {
    if (!SHOW_CAS_USAGE) {
      casUsageSection.classList.add('hidden');
    }
  }

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
      duration: 0.25,
      ease: 'power2.out',
    }, '+=0.1');
  });

  ScrollTrigger.create({
    trigger: '.workflow-diagram',
    start: 'top 70%',
    end: 'bottom top',
    onEnter: () => tl.restart(),
    onEnterBack: () => tl.restart(),
    onLeave: () => tl.progress(0).pause(),
    onLeaveBack: () => tl.progress(0).pause(),
  });
  // ✅ FIX : suppression de module.exports (invalide dans un navigateur)
})();

/* --- ARTICLE TOC : lien actif au scroll ------------------ */
(function initArticleToc() {
  const tocLinks = document.querySelectorAll('.article-toc a');
  if (!tocLinks.length) return;

  const headings = document.querySelectorAll(
    '.article-body h2[id], .article-body h3[id]'
  );

  /* ✅ AJOUT : scroll manuel avec offset dynamique */
  tocLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href')?.replace('#', '');
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      // Récupère la hauteur réelle du header sticky
      const header = document.querySelector('header, nav, .site-header, .navbar');
      const headerHeight = header ? header.offsetHeight : 100;
      const extraOffset = 96; // marge de confort

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        extraOffset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* IntersectionObserver pour le lien actif — inchangé */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(
          `.article-toc a[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-100px 0px -60% 0px' });

  headings.forEach(h => io.observe(h));
})();