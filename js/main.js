(function () {
  'use strict';

  // ── Sticky header shadow on scroll ──────────────────────────
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Mobile nav toggle ────────────────────────────────────────
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Jahr im Footer ───────────────────────────────────────────
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // ── Aktuelle Seite in der Navigation markieren ──────────────
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.site-nav__link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  // ── Scroll-Reveal ─────────────────────────────────────────────
  // Die .reveal-Klasse wird per CSS nur unsichtbar, wenn <html> die
  // Klasse "js" trägt (siehe Inline-Script im <head>). Hier wird nur
  // noch entschieden, WANN sichtbar gemacht wird. Falls der Observer
  // aus irgendeinem Grund nichts auslöst, sorgt ein Sicherheits-
  // Timeout dafür, dass nach spätestens 2s trotzdem alles sichtbar ist.
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('reveal--visible'); });
    }
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('reveal--visible'); });
    }, 2000);
  }

  // ── Leistungen: aktiver Sprungmarken-Link beim Scrollen ───────
  var subnavLinks = document.querySelectorAll('.subnav__link');
  var serviceBlocks = document.querySelectorAll('.service-block[id]');
  if (subnavLinks.length && serviceBlocks.length && 'IntersectionObserver' in window) {
    var subnavObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        subnavLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });
    serviceBlocks.forEach(function (block) { subnavObserver.observe(block); });
  }

  // ── Referenzen: Lightbox ─────────────────────────────────────
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var lightboxCaption = lightbox.querySelector('.lightbox__caption');
    var closeBtn = lightbox.querySelector('.lightbox__close');
    var openLightbox = function (src, caption) {
      lightboxImg.src = src;
      lightboxImg.alt = caption || '';
      lightboxCaption.textContent = caption || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    var closeLightbox = function () {
      lightbox.classList.remove('is-open');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    };
    document.querySelectorAll('.photo-grid__item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        var img = item.querySelector('img');
        openLightbox(item.getAttribute('href') || img.src, img.alt);
      });
    });
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

})();
