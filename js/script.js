/* =========================================================
   REDHILLS METRO PROPERTIES — SITE SCRIPT
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

  if (backdrop) {
    backdrop.addEventListener('click', closeNav);
  }

  // Close mobile nav with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) closeNav();
  });

  // Close mobile nav when a plain (non-dropdown) link is tapped
  if (nav) {
    var navLinks = nav.querySelectorAll('.nav__list > li > a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 980) closeNav();
      });
    });
  }

  /* ---------------------------------------------------------
     "Projects" dropdown — click to toggle (works desktop + mobile)
  --------------------------------------------------------- */
  var dropdownBtn = document.getElementById('projectsBtn');
  var dropdownWrap = dropdownBtn ? dropdownBtn.closest('.nav__dropdown') : null;

  function closeAllDropdowns() {
    document.querySelectorAll('.nav__dropdown.is-open').forEach(function (el) {
      el.classList.remove('is-open');
      var btn = el.querySelector('.nav__dropdown-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

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

  // Click outside closes any open dropdown (desktop behaviour)
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
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------
     Animated stat counters (17+, 25+, 1500+, 350+ ...)
  --------------------------------------------------------- */
  var statEls = document.querySelectorAll('.stat__num[data-count]');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1600; // ms
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('en-IN');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-IN');
      }
    }
    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statEls.length) {
    var statObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statEls.forEach(function (el) { statObserver.observe(el); });
  } else {
    statEls.forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
  }

  /* ---------------------------------------------------------
     Smooth-scroll for on-page hash links (e.g. #ongoing, #completed)
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

})();


/* Hero banner slider */
(function () {
  var slides = document.querySelectorAll('#bannerSlider .banner__slide');
  var dotsWrap = document.getElementById('bannerDots');
  if (!slides.length || !dotsWrap) return;

  var current = 0;
  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll('button');

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = index;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  setInterval(function () { goTo((current + 1) % slides.length); }, 5000);
})();


/* Gallery lightbox */
(function () {
  var grid = document.getElementById('galleryGrid');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var closeBtn = document.getElementById('lightboxClose');
  if (!grid || !lightbox || !lightboxImg || !closeBtn) return;

  grid.addEventListener('click', function (e) {
    var item = e.target.closest('.gallery-item');
    if (!item) return;
    lightboxImg.src = item.getAttribute('data-full');
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
})();

/* FAQ accordion */
(function () {
  var faqList = document.getElementById('faqList');
  if (!faqList) return;

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
})();


/* Home page enquiry form — front-end only for now, wire this to your backend */
(function () {
  var form = document.getElementById('homeEnquiryForm');
  var note = document.getElementById('homeEnquiryNote');
  if (!form || !note) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();

    if (!name || !phone) {
      note.textContent = 'Please fill in your name and phone number.';
      note.style.color = '#c0392b';
      return;
    }

    // TODO: replace with fetch() to your backend or a form service (e.g. Formspree, EmailJS)
    note.textContent = 'Thank you! Our team will call you back shortly.';
    note.style.color = 'var(--gold-600)';
    form.reset();
  });
})();