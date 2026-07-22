/* =========================================================
   REDHILLS METRO PROPERTIES — ABOUT PAGE SCRIPT
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
     Animated stat counters
  --------------------------------------------------------- */
  var statEls = document.querySelectorAll('.stat__num[data-count]');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
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

})();
