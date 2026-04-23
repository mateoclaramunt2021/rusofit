(function () {
    'use strict';

    /* =====================================================
       NAV — scroll shrink
       ===================================================== */
    var navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });


    /* =====================================================
       NAV — hamburger mobile
       ===================================================== */
    var navToggle = document.getElementById('navToggle');
    var navMenu   = document.getElementById('navMenu');

    function closeMenu() {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', function () {
        var open = navMenu.classList.toggle('open');
        navToggle.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('open') && !navbar.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });


    /* =====================================================
       SMOOTH SCROLL
       ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            var offset = navbar ? navbar.offsetHeight + 16 : 16;
            var top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });


    /* =====================================================
       SCROLL REVEAL — IntersectionObserver
       ===================================================== */
    var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                // Stagger siblings
                var parent = entry.target.parentElement;
                var siblings = Array.from(
                    parent.querySelectorAll(':scope > .reveal, :scope > .reveal-left, :scope > .reveal-right')
                );
                var idx   = siblings.indexOf(entry.target);
                var delay = Math.min(idx * 100, 420);

                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, delay);

                io.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }


    /* =====================================================
       COUNTER ANIMATION — +25
       ===================================================== */
    var counterEl = document.querySelector('[data-target]');

    if (counterEl && 'IntersectionObserver' in window) {
        var counterIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var target   = parseInt(entry.target.getAttribute('data-target'), 10);
                var start    = null;
                var duration = 1800;

                function tick(ts) {
                    if (!start) start = ts;
                    var progress = Math.min((ts - start) / duration, 1);
                    var eased    = 1 - Math.pow(1 - progress, 3);
                    var current  = Math.floor(eased * target);
                    entry.target.textContent = '+' + current;
                    if (progress < 1) { requestAnimationFrame(tick); }
                    else              { entry.target.textContent = '+' + target; }
                }

                requestAnimationFrame(tick);
                counterIO.unobserve(entry.target);
            });
        }, { threshold: 0.6 });

        counterIO.observe(counterEl);
    }


    /* =====================================================
       BEFORE / AFTER SLIDER
       ===================================================== */
    var baSlider = document.getElementById('baSlider');
    var baHandle = document.getElementById('baHandle');
    var baRange  = document.getElementById('baRange');

    if (baSlider && baHandle && baRange) {
        var baBefore = baSlider.querySelector('.ba-before');

        function setVal(v) {
            v = Math.min(Math.max(v, 0), 100);
            baBefore.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
            baHandle.style.left     = v + '%';
            baRange.value           = v;
        }

        // Initialize at 50%
        setVal(50);

        // Range input (keyboard accessible)
        baRange.addEventListener('input', function () {
            setVal(parseFloat(this.value));
        });

        // Mouse / touch drag
        var dragging = false;

        function getPct(e) {
            var rect    = baSlider.getBoundingClientRect();
            var clientX = e.touches ? e.touches[0].clientX : e.clientX;
            return ((clientX - rect.left) / rect.width) * 100;
        }

        baSlider.addEventListener('mousedown',  function () { dragging = true; });
        baSlider.addEventListener('touchstart', function () { dragging = true; }, { passive: true });

        window.addEventListener('mousemove', function (e) {
            if (dragging) setVal(getPct(e));
        });
        window.addEventListener('touchmove', function (e) {
            if (dragging) setVal(getPct(e));
        }, { passive: true });

        window.addEventListener('mouseup',  function () { dragging = false; });
        window.addEventListener('touchend', function () { dragging = false; });
    }


    /* =====================================================
       HERO PARALLAX — desktop only
       ===================================================== */
    var heroPhoto = document.querySelector('.hero__photo');

    if (heroPhoto && window.matchMedia('(min-width: 769px)').matches) {
        window.addEventListener('scroll', function () {
            if (window.scrollY < window.innerHeight) {
                heroPhoto.style.transform = 'translateY(' + window.scrollY * 0.07 + 'px)';
            }
        }, { passive: true });
    }


    /* =====================================================
       WHATSAPP FLOAT — hide at footer
       ===================================================== */
    var waFloat = document.querySelector('.wa-float');
    var footer  = document.querySelector('.footer');

    if (waFloat && footer && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                waFloat.style.opacity      = entry.isIntersecting ? '0' : '1';
                waFloat.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
            });
        }, { threshold: 0.15 }).observe(footer);
    }

}());
