/* ---------------------------------------------------------
   SERVICES PAGE — quick nav chip scrollspy
   Highlights the chip matching the section currently in view,
   and keeps that chip scrolled into sight on mobile.
--------------------------------------------------------- */
(function () {
  var chips = document.querySelectorAll('.quicknav__chip');
  var quicknav = document.querySelector('.quicknav');
  if (!chips.length || !quicknav) return;

  var sections = [];
  chips.forEach(function (chip) {
    var id = chip.getAttribute('href').split('#')[1];
    var section = document.getElementById(id);
    if (section) sections.push({ id: id, section: section, chip: chip });
  });

  if (!sections.length) return;

  function setActiveChip(id) {
    chips.forEach(function (chip) {
      chip.classList.toggle('is-active', chip.getAttribute('href') === '#' + id);
    });
    var activeChip = quicknav.querySelector('.quicknav__chip.is-active');
    if (activeChip) {
      var trackRect = quicknav.getBoundingClientRect();
      var chipRect = activeChip.getBoundingClientRect();
      if (chipRect.left < trackRect.left || chipRect.right > trackRect.right) {
        activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }

  if ('IntersectionObserver' in window) {
    var headerOffset = 140; // roughly header + ticker + quicknav height
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveChip(entry.target.id);
          }
        });
      },
      { rootMargin: '-' + headerOffset + 'px 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { spyObserver.observe(s.section); });
  }
})();