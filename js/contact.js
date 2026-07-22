/* =========================================================
   REDHILLS METRO PROPERTIES — CONTACT PAGE SCRIPT
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Header: shrink + shadow on scroll
  --------------------------------------------------------- */
  var header = document.getElementById('siteHeader');
  function updateHeaderScrollState() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  updateHeaderScrollState();
  window.addEventListener('scroll', updateHeaderScrollState, { passive: true });

  /* ---------------------------------------------------------
     Mobile nav: hamburger + backdrop
  --------------------------------------------------------- */
  var hamburger = document.getElementById('hamburgerBtn');
  var nav = document.getElementById('siteNav');
  var backdrop = document.getElementById('navBackdrop');

  function closeAllDropdowns() {
    document.querySelectorAll('.nav__dropdown.is-open').forEach(function (el) {
      el.classList.remove('is-open');
      var btn = el.querySelector('.nav__dropdown-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function openNav() {
    if (!nav || !hamburger || !backdrop) return;
    nav.classList.add('is-open');
    backdrop.classList.add('is-visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!nav || !hamburger || !backdrop) return;
    nav.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    closeAllDropdowns();
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.contains('is-open');
      if (isOpen) closeNav();
      else openNav();
    });
  }

  if (backdrop) backdrop.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) closeNav();
  });

  if (nav) {
    var navLinks = nav.querySelectorAll('.nav__list > li > a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 980) closeNav();
      });
    });
  }

  /* ---------------------------------------------------------
     "Projects" dropdown
  --------------------------------------------------------- */
  var dropdownBtn = document.getElementById('projectsBtn');
  var dropdownWrap = dropdownBtn ? dropdownBtn.closest('.nav__dropdown') : null;

  if (dropdownBtn && dropdownWrap) {
    dropdownBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var willOpen = !dropdownWrap.classList.contains('is-open');
      closeAllDropdowns();
      if (willOpen) {
        dropdownWrap.classList.add('is-open');
        dropdownBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  document.addEventListener('click', function (e) {
    if (!dropdownWrap) return;
    if (!dropdownWrap.contains(e.target)) {
      dropdownWrap.classList.remove('is-open');
      if (dropdownBtn) dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------------------------------------------------------
     Scroll reveal animations
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------
     Smooth-scroll for on-page hash links
  --------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="#"]');
    if (!link) return;
    var url = new URL(link.href, window.location.href);
    var samePage = url.pathname === window.location.pathname;
    var hash = url.hash;
    if (samePage && hash) {
      var targetEl = document.querySelector(hash);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeNav();
      }
    }
  });

  /* ---------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------- */
  var faqList = document.getElementById('contactFaqList');
  if (faqList) {
    faqList.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-item__q');
      if (!btn) return;
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('is-open');

      faqList.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ---------------------------------------------------------
     Button ripple effect
  --------------------------------------------------------- */
  document.querySelectorAll('.btn--gold, .btn--outline, .btn--outline-light').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      ripple.className = 'btn__ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      window.setTimeout(function () { ripple.remove(); }, 650);
    });
  });

  /* ---------------------------------------------------------
     Contact form validation + fake submit
  --------------------------------------------------------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('contactFormNote');
  var submitBtn = document.getElementById('contactSubmitBtn');

  function setError(fieldId, message) {
    var errorEl = form.querySelector('[data-error-for="' + fieldId + '"]');
    var fieldEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message || '';
    if (fieldEl) fieldEl.classList.toggle('is-invalid', !!message);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[6-9]\d{9}$/.test(value.replace(/\D/g, '').slice(-10));
  }

  if (form && note && submitBtn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fullName = form.fullName.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var subject = form.subject.value.trim();
      var interest = form.interest.value;
      var message = form.message.value.trim();
      var consent = form.consent.checked;

      var valid = true;

      if (!fullName) { setError('cFullName', 'Please enter your full name.'); valid = false; }
      else setError('cFullName');

      if (!email || !isValidEmail(email)) { setError('cEmail', 'Please enter a valid email address.'); valid = false; }
      else setError('cEmail');

      if (!phone || !isValidPhone(phone)) { setError('cPhone', 'Please enter a valid 10-digit phone number.'); valid = false; }
      else setError('cPhone');

      if (!subject) { setError('cSubject', 'Please enter a subject.'); valid = false; }
      else setError('cSubject');

      if (!interest) { setError('cInterest', 'Please select a service.'); valid = false; }
      else setError('cInterest');

      if (!message) { setError('cMessage', 'Please add a short message.'); valid = false; }
      else setError('cMessage');

      if (!consent) { setError('cConsent', 'Please accept the Privacy Policy to continue.'); valid = false; }
      else setError('cConsent');

      if (!valid) {
        note.textContent = 'Please fix the highlighted fields and try again.';
        note.classList.add('is-error');
        return;
      }

      note.classList.remove('is-error');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      // TODO: replace with fetch() to your backend or a form service (e.g. Formspree, EmailJS)
      window.setTimeout(function () {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        note.textContent = 'Thank you, ' + fullName.split(' ')[0] + '! Our team will call you back shortly.';
        form.reset();
      }, 900);
    });
  }
})();