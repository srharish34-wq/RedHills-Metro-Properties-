(function () {
    'use strict';

    /* ---------- Projects dropdown toggle ---------- */
    var projectsDropdown = document.getElementById('projectsDropdown');
    var projectsDropdownTrigger = document.getElementById('projectsDropdownTrigger');
    if (projectsDropdown && projectsDropdownTrigger) {
        projectsDropdownTrigger.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = projectsDropdown.classList.toggle('is-open');
            projectsDropdownTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        document.addEventListener('click', function (e) {
            if (!projectsDropdown.contains(e.target)) {
                projectsDropdown.classList.remove('is-open');
                projectsDropdownTrigger.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                projectsDropdown.classList.remove('is-open');
                projectsDropdownTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ---------- Footer year auto-update ---------- */
    var yearEls = document.querySelectorAll('footer p');
    yearEls.forEach(function (el) {
        if (el.textContent.includes('©️')) {
            el.textContent = el.textContent.replace(/\d{4}/, new Date().getFullYear());
        }
    });

    /* ---------- Header scroll shadow ---------- */
    var header = document.querySelector('nav');
    function updateHeaderScrollState() {
        if (!header) return;
        header.style.boxShadow = window.scrollY > 12 ? '0 4px 16px rgba(8,15,34,.35)' : 'none';
    }
    updateHeaderScrollState();
    window.addEventListener('scroll', updateHeaderScrollState, { passive: true });

    /* ---------- Smooth scroll for on-page anchors ---------- */
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
            }
        }
    });

    /* ---------- Stat counter animation ---------- */
    var statNums = document.querySelectorAll('.stat-number');
    var hasAnimated = {};

    function animateCount(el) {
        var text = el.textContent;
        var target = parseInt(text.replace(/\D/g, ''), 10) || 0;
        var suffix = text.replace(/\d+/g, '');
        var duration = 1600;
        var startTime = null;

        function step(timestamp) {
            if (startTime === null) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString('en-IN') + suffix;
            }
        }
        window.requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window && statNums.length) {
        var statObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !hasAnimated[entry.target]) {
                    hasAnimated[entry.target] = true;
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        statNums.forEach(function (el) { statObserver.observe(el); });
    }

    /* ---------- Button functionality (Enquire / Call) ---------- */
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.enquire-btn, .card-btn');
        if (!btn) return;
        e.preventDefault();
        window.location.href = 'index.html#enquireHome';
    });

    /* =========================================================
       COMPLETED PROJECTS DATA + CAROUSEL
       ========================================================= */
    var projects = [
        {
            id: 1,
            title: 'BK Garden Phase 2 & 3',
            location: 'Chennai',
            status: 'Completed',
            description: 'Residential layout, fully sold and registered with CMDA/DTCP approvals and clear title documentation.',
            images: ['images/bk-garden-1.jpeg', 'images/bk-garden-2.jpeg', 'images/bk-garden-3.jpeg']
        },
        {
            id: 2,
            title: 'KK Nagar (Edapaliyam)',
            location: 'Edapaliyam, Chennai',
            status: 'Completed',
            description: 'Residential plot layout at Edapaliyam, successfully delivered with clear title documentation.',
            images: ['images/kk-nagar-1.jpeg', 'images/kk-nagar-2.jpeg', 'images/kk-nagar-3.jpeg']
        },
        {
            id: 3,
            title: 'Spring Phase 1',
            location: 'Chennai',
            status: 'Completed',
            description: 'Residential plot layout, fully delivered with CMDA/DTCP approvals and clear title documentation.',
            images: ['images/spring-1.jpeg', 'images/spring-2.jpeg', 'images/spring-3.jpeg']
        },
        {
            id: 4,
            title: 'Rajmano Avenue Phase 1',
            location: 'Chennai',
            status: 'Completed',
            description: 'Residential plot layout, fully delivered with CMDA/DTCP approvals and clear title documentation.',
            images: ['images/rajmano-1.jpeg', 'images/rajmano-2.jpeg', 'images/rajmano-3.jpeg']
        },
        {
            id: 5,
            title: 'KK Farm Land',
            location: 'Chennai',
            status: 'Completed',
            description: 'Farm land parcels sold and transferred with complete survey records and clear ownership documentation.',
            images: ['images/kk-farmland-1.jpeg', 'images/kk-farmland-2.jpeg', 'images/kk-farmland-3.jpeg']
        },
        {
            id: 6,
            title: 'Commercials Layout (MK)',
            location: 'Chennai',
            status: 'Completed',
            description: 'Commercial plot layout, fully sold with CMDA/DTCP approvals and clear title documentation.',
            images: ['images/commercials-mk-1.jpeg', 'images/commercials-mk-2.jpeg', 'images/commercials-mk-3.jpeg']
        }
    ];

    /* Each project tracks which stacked <img> layer ("a" / "b") is visible,
       and which slide index that layer currently shows. */
    var carouselState = {};
    var carouselTimers = {};

    projects.forEach(function (project) {
        carouselState[project.id] = { activeLayer: 'a', currentIndex: 0 };
    });

    function renderProjects() {
        var grid = document.getElementById('projectsGrid');
        if (!grid) return;

        grid.innerHTML = projects.map(function (project) {
            var dots = project.images.map(function (_, index) {
                return '<div class="indicator-dot' + (index === 0 ? ' active' : '') + '"></div>';
            }).join('');

            return (
                '<div class="project-card" data-project-id="' + project.id + '">' +
                    '<div class="carousel-container">' +
                        '<img class="carousel-image is-active" data-layer="a" src="' + project.images[0] + '" alt="' + project.title + '">' +
                        '<img class="carousel-image" data-layer="b" src="' + (project.images[1] || project.images[0]) + '" alt="' + project.title + '">' +
                        '<div class="status-badge">' + project.status + '</div>' +
                        '<div class="image-counter">1/' + project.images.length + '</div>' +
                        '<div class="image-indicators">' + dots + '</div>' +
                    '</div>' +
                    '<div class="card-content">' +
                        '<h3>' + project.title + '</h3>' +
                        '<p class="card-location">📍 ' + project.location + '</p>' +
                        '<p>' + project.description + '</p>' +
                        '<button class="card-btn">Enquire Now</button>' +
                    '</div>' +
                '</div>'
            );
        }).join('');
    }

    function advanceCarousel(project) {
        var card = document.querySelector('.project-card[data-project-id="' + project.id + '"]');
        if (!card) return;

        var state = carouselState[project.id];
        var nextIndex = (state.currentIndex + 1) % project.images.length;
        var inactiveLayer = state.activeLayer === 'a' ? 'b' : 'a';

        var inactiveImg = card.querySelector('.carousel-image[data-layer="' + inactiveLayer + '"]');
        var activeImg = card.querySelector('.carousel-image[data-layer="' + state.activeLayer + '"]');
        if (!inactiveImg || !activeImg) return;

        inactiveImg.src = project.images[nextIndex];
        inactiveImg.classList.add('is-active');
        activeImg.classList.remove('is-active');

        var counter = card.querySelector('.image-counter');
        if (counter) counter.textContent = (nextIndex + 1) + '/' + project.images.length;

        var dots = card.querySelectorAll('.indicator-dot');
        dots.forEach(function (dot, i) { dot.classList.toggle('active', i === nextIndex); });

        state.activeLayer = inactiveLayer;
        state.currentIndex = nextIndex;
    }

    function startCarousels() {
        projects.forEach(function (project, i) {
            if (project.images.length < 2) return;
            carouselTimers[project.id] = setInterval(function () {
                advanceCarousel(project);
            }, 3800 + i * 350); // slight stagger so cards don't flip in sync

            var card = document.querySelector('.project-card[data-project-id="' + project.id + '"]');
            if (card) {
                card.addEventListener('mouseenter', function () {
                    clearInterval(carouselTimers[project.id]);
                });
                card.addEventListener('mouseleave', function () {
                    carouselTimers[project.id] = setInterval(function () {
                        advanceCarousel(project);
                    }, 3800 + i * 350);
                });
            }
        });
    }

    function revealCards() {
        var cards = document.querySelectorAll('.project-card');
        if (!cards.length) return;

        if (!('IntersectionObserver' in window)) {
            cards.forEach(function (el) { el.style.opacity = '1'; });
            return;
        }

        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        cards.forEach(function (el) { revealObserver.observe(el); });
    }

    document.addEventListener('DOMContentLoaded', function () {
        renderProjects();
        revealCards();
        startCarousels();
    });
})();


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
     Mobile nav: hamburger + backdrop
  --------------------------------------------------------- */
  var hamburger = document.getElementById('hamburgerBtn');
  var nav = document.getElementById('siteNav');
  var backdrop = document.getElementById('navBackdrop'); // optional, may not exist in HTML

  function openNav() {
    if (!nav || !hamburger) return;
    nav.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-visible');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!nav || !hamburger) return;
    nav.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-visible');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('is-active');
    document.body.style.overflow = '';
    closeAllDropdowns();
  }

  if (hamburger && nav) {
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
