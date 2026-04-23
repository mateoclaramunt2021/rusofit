/* ================================================
   RUSOFIT — JAVASCRIPT
   ================================================ */

(function () {
    'use strict';

    // ---- NAV: Scroll shrink ----
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // run on load


    // ---- NAV: Mobile hamburger ----
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');

    function closeMenu() {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
    }

    function openMenu() {
        navMenu.classList.add('open');
        navToggle.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    navToggle.addEventListener('click', function () {
        if (navMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on nav link click
    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside tap
    document.addEventListener('click', function (e) {
        if (
            navMenu.classList.contains('open') &&
            !navbar.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });


    // ---- SCROLL REVEAL ----
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;

                    // Stagger siblings inside the same grid/flex container
                    const parent   = entry.target.parentElement;
                    const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
                    const idx      = siblings.indexOf(entry.target);
                    const delay    = Math.min(idx * 110, 440); // max 440ms stagger

                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, delay);

                    revealObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealEls.forEach(function (el) {
            revealObserver.observe(el);
        });

    } else {
        // Fallback: show all immediately
        revealEls.forEach(function (el) {
            el.classList.add('visible');
        });
    }


    // ---- SMOOTH SCROLL for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            var navH   = navbar ? navbar.offsetHeight : 0;
            var targetY = target.getBoundingClientRect().top + window.scrollY - navH - 16;

            window.scrollTo({ top: targetY, behavior: 'smooth' });
        });
    });


    // ---- ACTIVE NAV LINK on scroll ----
    var sections  = document.querySelectorAll('section[id]');
    var navLinks  = document.querySelectorAll('.nav__link[href^="#"]');

    if ('IntersectionObserver' in window && navLinks.length) {
        var activeObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var id = entry.target.getAttribute('id');
                    navLinks.forEach(function (link) {
                        link.classList.toggle(
                            'active',
                            link.getAttribute('href') === '#' + id
                        );
                    });
                });
            },
            { threshold: 0.35 }
        );

        sections.forEach(function (sec) { activeObserver.observe(sec); });
    }


    // ---- SUBTLE PARALLAX on hero image (desktop only) ----
    var heroImage = document.querySelector('.hero__image');

    if (heroImage && window.matchMedia('(min-width: 769px)').matches) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroImage.style.transform = 'translateY(' + scrollY * 0.06 + 'px)';
            }
        }, { passive: true });
    }


    // ---- WHATSAPP FLOAT: hide when footer visible ----
    var waFloat = document.querySelector('.whatsapp-float');
    var footer  = document.querySelector('.footer');

    if (waFloat && footer && 'IntersectionObserver' in window) {
        var footerObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    waFloat.style.opacity      = entry.isIntersecting ? '0' : '1';
                    waFloat.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
                });
            },
            { threshold: 0.2 }
        );
        footerObserver.observe(footer);
    }

})();
