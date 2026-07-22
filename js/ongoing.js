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
            title: 'SVK Nagar Phase 2',
            location: 'Chennai',
            status: 'Ongoing',
            stage: 'Site Development',
            progress: 70,
            description: 'CMDA approved residential plots, actively under site development with roads and EB works in progress.',
            images: ['images/svk-nagar-2-a.jpeg', 'images/svk-nagar-2-b.jpeg', 'images/svk-nagar-2-c.jpeg']
        },
        {
            id: 2,
            title: 'SVK Nagar Phase 3',
            location: 'Chennai',
            status: 'Ongoing',
            stage: 'Approval Stage',
            progress: 45,
            description: 'The next phase of SVK Nagar, currently moving through CMDA/DTCP layout approval.',
            images: ['images/svk-nagar-3-a.jpeg', 'images/svk-nagar-3-b.jpeg', 'images/svk-nagar-3-c.jpeg']
        },
        {
            id: 3,
            title: 'MN Nagar',
            location: 'Chennai',
            status: 'Ongoing',
            stage: 'Site Development',
            progress: 60,
            description: 'DTCP approved residential layout, with plot demarcation and infrastructure work underway.',
            images: ['images/mn-nagar-a.jpeg', 'images/mn-nagar-b.jpeg', 'images/mn-nagar-c.jpeg']
        },
        {
            id: 4,
            title: 'SRP Phase 1–5',
            location: 'Chennai',
            status: 'Ongoing',
            stage: 'Multi-Phase Development',
            progress: 55,
            description: 'A five-phase residential plot development, with early phases in active sale and later phases in layout approval.',
            images: ['images/srp-a.jpeg', 'images/srp-b.jpeg', 'images/srp-c.jpeg']
        },
        {
            id: 5,
            title: 'Farm Land - KK Nagar',
            location: 'KK Nagar, Chennai',
            status: 'Ongoing',
            stage: 'Plot Demarcation',
            progress: 50,
            description: 'Acre-sized farm land parcels at KK Nagar, currently being surveyed and demarcated for sale.',
            images: ['images/farmland-kk-a.jpeg', 'images/farmland-kk-b.jpeg', 'images/farmland-kk-c.jpeg']
        },
        {
            id: 6,
            title: 'Rajmano Avenue Phase 2',
            location: 'Chennai',
            status: 'Ongoing',
            stage: 'Approval Stage',
            progress: 40,
            description: 'The second phase of Rajmano Avenue, currently under CMDA/DTCP approval following Phase 1\u2019s success.',
            images: ['images/rajmano-avenue-2-a.jpeg', 'images/rajmano-avenue-2-b.jpeg', 'images/rajmano-avenue-2-c.jpeg']
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
                        '<div class="progress-wrap">' +
                            '<div class="progress-label"><span>' + project.stage + '</span><span>' + project.progress + '%</span></div>' +
                            '<div class="progress-track"><div class="progress-fill" style="width:' + project.progress + '%;"></div></div>' +
                        '</div>' +
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
