/* =============================================
   YANALABS — main.js
   ============================================= */

/* --- BFCACHE FIX ----------------------------------------- */
window.addEventListener('pageshow', (e) => {
  if (e.persisted) window.location.reload();
});

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
    // Modifications 20260424 par Openclaw — validation format + formatage séparé de la validation
    /*
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
    */
    const phone = form.querySelector('#phone');
    const phoneClean = phone.value.trim().replace(/\s/g, '');
    const phoneRegex = /^0[1-9][0-9]{8}$/;
    if (!phoneClean) {
      showError(phone, 'phone-error', '⚠️ Le numéro de téléphone est obligatoire.');
      hasError = true;
    } else if (!phoneRegex.test(phoneClean)) {
      showError(phone, 'phone-error', '⚠️ Format attendu : 06 12 34 56 78');
      hasError = true;
    } else {
      clearError(phone, 'phone-error');
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

    const rawPhone = form.querySelector('#phone').value.trim().replace(/\s/g, '').replace(/^0/, '');
    const params = new URLSearchParams({
      nom:        form.querySelector('#nom').value.trim(),
      prenom:     form.querySelector('#prenom').value.trim(),
      email:      form.querySelector('#email').value.trim(),
      phone:      '+33' + rawPhone,
      entreprise: form.querySelector('#entreprise').value.trim(),
      besoin:     form.querySelector('#besoin').value.trim()
    });

    try {
      const res = await fetch('https://hook.eu1.make.com/dbsob3hxaxff8flhljj66mk977oitkrg', {
        method: 'POST',
        body: params
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

    const params = new URLSearchParams({
      email: emailInput.value.trim(),
      gdpr:  gdpr.checked ? 'on' : ''
    });

    try {
      const res = await fetch('https://hook.eu1.make.com/9uem47pfvdxfiu72q7vxq4t9yn1eotxj', {
        method: 'POST',
        body: params
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

/* --- TASK CARD ANIMATION --------------------------------- */
(function initTaskCard() {
  const TASKS          = 4;
  const TIME_PER_TASK  = 1100;
  const PAUSE_AFTER    = 3200;
  const HOURS_PER_TASK = 2;

  // Si la card n'est pas dans la page, on sort
  if (!document.getElementById('row-0')) return;

  let autoCount     = 0;
  let timeCount     = 0;
  let elapsed       = 0;
  let running       = false;
  let timerInterval = null;

  function fmt2(n) { return String(n).padStart(2, '0'); }

  function animCounter(el, target, suffix, duration) {
    if (!el) return;
    const start     = parseInt(el.textContent) || 0;
    const range     = target - start;
    const startTime = performance.now();
    (function tick(now) {
      const t    = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(start + range * ease) + (suffix || '');
      if (t < 1) requestAnimationFrame(tick);
      else el.classList.add('active');
    })(performance.now());
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      elapsed++;
      const el = document.getElementById('footer-time');
      if (el) el.textContent = fmt2(Math.floor(elapsed / 60)) + ':' + fmt2(elapsed % 60);
    }, 1000);
  }

  function checkTask(i) {
    const row   = document.getElementById('row-'   + i);
    const bg    = document.getElementById('bg-'    + i);
    const chk   = document.getElementById('chk-'   + i);
    const name  = document.getElementById('name-'  + i);
    const flash = document.getElementById('flash-' + i);
    if (!row) return;

    row.classList.add('checking');

    const rip = document.createElement('div');
    rip.className = 'ripple';
    row.appendChild(rip);
    setTimeout(() => rip.remove(), 600);

    flash.style.opacity = '0.07';
    setTimeout(() => { flash.style.opacity = '0'; }, 250);

    setTimeout(() => {
      bg.classList.add('done');
      chk.classList.add('visible');
      name.classList.add('done');
      row.classList.remove('checking');

      const prog = document.getElementById('prog');
      // Modifié par Claude Code le 20260503 — scaleX au lieu de width (compositable GPU)
      if (prog) prog.style.transform = 'scaleX(' + ((i + 1) / TASKS) + ')';

      autoCount++;
      timeCount += HOURS_PER_TASK;
      animCounter(document.getElementById('cnt-auto'), autoCount, '',  400);
      animCounter(document.getElementById('cnt-time'), timeCount, 'h', 400);

      const footerText = document.getElementById('footer-text');
      if (i < TASKS - 1) {
        if (footerText) footerText.textContent = (i + 1) + '/' + TASKS + ' tâches traitées';
      } else {
        const footerMsg = document.getElementById('footer-msg');
        if (footerMsg) footerMsg.classList.add('done');
        if (footerText) footerText.textContent = 'Toutes les tâches traitées ✓';
        const statusText = document.getElementById('status-text');
        if (statusText) statusText.textContent = 'Terminé';
        clearInterval(timerInterval);
        setTimeout(resetAll, PAUSE_AFTER);
      }
    }, 220);
  }

  function resetAll() {
    for (let i = 0; i < TASKS; i++) {
      const bg   = document.getElementById('bg-'   + i);
      const chk  = document.getElementById('chk-'  + i);
      const name = document.getElementById('name-' + i);
      if (bg)   bg.classList.remove('done');
      if (chk)  chk.classList.remove('visible');
      if (name) name.classList.remove('done');
    }
    const prog       = document.getElementById('prog');
    const footerMsg  = document.getElementById('footer-msg');
    const footerText = document.getElementById('footer-text');
    const footerTime = document.getElementById('footer-time');
    const statusText = document.getElementById('status-text');
    const cntAuto    = document.getElementById('cnt-auto');
    const cntTime    = document.getElementById('cnt-time');
    const cntYou     = document.getElementById('cnt-you');

    // Modifié par Claude Code le 20260503 — scaleX au lieu de width (compositable GPU)
    if (prog)       prog.style.transform    = 'scaleX(0)';
    if (footerMsg)  footerMsg.classList.remove('done');
    if (footerText) footerText.textContent  = 'Traitement en cours...';
    if (footerTime) footerTime.textContent  = '00:00';
    if (statusText) statusText.textContent  = 'En cours';
    if (cntYou)     cntYou.textContent      = '0';
    if (cntAuto)  { cntAuto.textContent     = '0'; cntAuto.classList.remove('active'); }
    if (cntTime)  { cntTime.textContent     = '0h'; cntTime.classList.remove('active'); }

    autoCount = 0;
    timeCount = 0;
    elapsed   = 0;
    running   = false;

    setTimeout(runSequence, 1000);
  }

  function runSequence() {
    if (running) return;
    running = true;
    startTimer();

    let delay = 800;
    for (let i = 0; i < TASKS; i++) {
      (function(idx) {
        setTimeout(() => checkTask(idx), delay);
      })(i);
      delay += TIME_PER_TASK;
    }
  }

  runSequence();
})();

/* --- SMOOTH SCROLL for anchors --------------------------- */

/* Retourne la distance entre le haut du viewport et le bas de la navbar fixe.
   AVANT : on utilisait navbar.offsetHeight (~70px) sans tenir compte du top:24px CSS,
   ce qui sous-estimait l'offset réel (~94px) et cachait 4px de contenu sous la navbar.
   getBoundingClientRect().bottom donne directement la position réelle du bas de la navbar. */
function getNavOffset() {
  const navbar = document.querySelector('.navbar');
  return navbar ? navbar.getBoundingClientRect().bottom + 20 : 120;
}

document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    // Les liens du sommaire article ont leur propre handler (initArticleToc).
    // Sans ce garde-fou, le smooth scroll applique sectionPadding=120 (fallback)
    // sur un h2 qui n'a pas de padding → titre scroll à -2px (derrière la navbar).
    if (this.closest('.article-toc')) return;

    const href = this.getAttribute('href');

    // Liens type /#section (menu principal → sections de la homepage)
    // Calcul : on veut que le premier contenu de la section (après son padding-top)
    // arrive exactement au bas de la navbar.
    // → offset = navbarBottom - sectionPaddingTop  (souvent négatif : la section
    //   monte légèrement au-dessus du viewport, son contenu tombe pile sous la navbar)
    if (href.startsWith('/#')) {
      const id = href.slice(1); // → "#section"
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const navbar = document.querySelector('.navbar');
        const navbarBottom = navbar ? navbar.getBoundingClientRect().bottom : 94;
        const sectionPadding = parseFloat(getComputedStyle(target).paddingTop) || 120;
        const margin = 24; // espace entre la navbar et le premier contenu de la section
        const top = target.getBoundingClientRect().top + window.scrollY - (navbarBottom - sectionPadding + margin);
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Sinon laisser naviguer normalement vers /#section
      return;
    }

    // Liens type #section (même page)
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navbar = document.querySelector('.navbar');
      const navbarBottom = navbar ? navbar.getBoundingClientRect().bottom : 94;
      const sectionPadding = parseFloat(getComputedStyle(target).paddingTop) || 120;
      const top = target.getBoundingClientRect().top + window.scrollY - (navbarBottom - sectionPadding) + 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* --- GSAP WORKFLOW SCROLL ANIMATION ----------------------- */
(function initWorkflowAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* --- CAS D'USAGE — variable on/off ----------------------- */
  const SHOW_CAS_USAGE = true; /* ← true = visible / false = caché */

  const casUsageSection = document.getElementById('cas-usage');
  if (casUsageSection) {
    if (!SHOW_CAS_USAGE) {
      casUsageSection.classList.add('hidden');
    }
  }

  const diagrams = document.querySelectorAll('.workflow-diagram');
  if (!diagrams.length) return;

  diagrams.forEach((diagram) => {
    const steps = diagram.querySelectorAll('.wf-node, .wf-connector-v, .wf-node-non');
    if (!steps.length) return;

    const tl = gsap.timeline({ paused: true });

    gsap.set(steps, { opacity: 0, y: 20 });

    steps.forEach((el) => {
      tl.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
      }, '+=0.1');
    });

    ScrollTrigger.create({
      trigger: diagram,
      start: 'top bottom',
      onEnter:      () => tl.restart(),
      onEnterBack:  () => tl.restart(),
      onLeaveBack:  () => { tl.progress(0).pause(); },
    });
  });

  /* Refresh après que tout soit rendu */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    // Si on arrive depuis une autre page avec un hash (#faq, #about…)
    // on rescroll après que GSAP ait recalculé les positions
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          const navbar = document.querySelector('.navbar');
          const navbarBottom = navbar ? navbar.getBoundingClientRect().bottom : 94;
          const sectionPadding = parseFloat(getComputedStyle(target).paddingTop) || 120;
          const top = target.getBoundingClientRect().top + window.scrollY - (navbarBottom - sectionPadding + 24);
          window.scrollTo({ top, behavior: 'smooth' });
        }, 100);
      }
    }
  });
  // ✅ FIX : suppression de module.exports (invalide dans un navigateur)
})();

/* --- ARTICLE TOC : scroll dédié + lien actif ------------- */
(function initArticleToc() {
  const tocLinks = document.querySelectorAll('.article-toc a');
  if (!tocLinks.length) return;

  const headings = document.querySelectorAll(
    '.article-body h2[id], .article-body h3[id]'
  );

  /* Scroll dédié aux titres article.
     Calcul direct : titre positionné à navbar.bottom + 30px sous la navbar.
     scrollIntoView ignoré car son support de scroll-margin-top est inconsistant. */
  function scrollToArticleHeading(target) {
    const navbar = document.querySelector('.navbar');
    const navbarBottom = navbar ? navbar.getBoundingClientRect().bottom : 94;
    const top = target.getBoundingClientRect().top + window.scrollY - navbarBottom - 60;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  tocLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href')?.replace('#', '');
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;
      scrollToArticleHeading(target);
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
const video = document.getElementById('yanaVideo');
const soundBtn = document.getElementById('soundBtn');
const iconMuted = document.getElementById('iconMuted');
const iconSound = document.getElementById('iconSound');

if (soundBtn && video) {

  // Bouton son visible immédiatement
  soundBtn.classList.add('visible');

  // Bouton son — toggle mute/unmute
  soundBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
      iconMuted.style.display = 'block';
      iconSound.style.display = 'none';
      soundBtn.setAttribute('aria-label', 'Activer le son');
    } else {
      iconMuted.style.display = 'none';
      iconSound.style.display = 'block';
      soundBtn.setAttribute('aria-label', 'Couper le son');
    }
  });

}