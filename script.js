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


    /* =====================================================
       FORMULARIO CONTACTO — EmailJS
       ─────────────────────────────────────────────────────
       CÓMO CONFIGURAR (una sola vez):
       1. Crea cuenta GRATIS en https://www.emailjs.com
       2. Ve a "Email Services" → "Add New Service"
          → elige Gmail → conecta neuriaxx@gmail.com
          → copia el Service ID
       3. Ve a "Email Templates" → "Create New Template"
          ── PLANTILLA 1 (para ti, el propietario) ──
             To:      neuriaxx@gmail.com
             Subject: Nueva solicitud RusoFit — {{nombre}}
             Body:
               🏋️ NUEVA SOLICITUD
               Nombre:      {{nombre}}
               Correo:      {{correo}}
               WhatsApp:    {{whatsapp}}
               Objetivo:    {{objetivo}}
               Días/sem.:   {{dias}}
               Experiencia: {{experiencia}}
               Sin result.: {{tiempo}}
               Lesiones:    {{lesiones}}
          → copia el Template ID → ponlo en EMAILJS_TEMPLATE_OWNER
          ── PLANTILLA 2 (confirmación para el cliente) ──
             To:      {{correo}}
             Subject: ¡Solicitud recibida, {{nombre}}! 🔥
             Body:
               Hola {{nombre}},
               Tu solicitud a RusoFit ha sido recibida.
               Ruso te escribirá en menos de 24h al WhatsApp {{whatsapp}}.
               Si quieres hablar antes: +34 677 119 453
               El equipo RusoFit
          → copia el Template ID → ponlo en EMAILJS_TEMPLATE_CLIENT
       4. Ve a "Account" → "General" → copia tu Public Key
       5. Sustituye los 4 valores de abajo con los tuyos
       ===================================================== */

    var EMAILJS_PUBLIC_KEY      = '7i1XqcX9I2ZKEbQ3H';
    var EMAILJS_SERVICE_ID      = 'service_tjscmwc';
    var EMAILJS_TEMPLATE_OWNER  = 'template_wc8rpw9';
    var EMAILJS_TEMPLATE_CLIENT = 'template_5ce5uop';

    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');
    var formBtn     = document.getElementById('formBtn');

    var BTN_DEFAULT = 'Enviar solicitud <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

    if (contactForm && formSuccess && formBtn) {

        if (typeof emailjs !== 'undefined') {
            emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        }

        /* — clear error state on input — */
        contactForm.querySelectorAll('.form__input').forEach(function (el) {
            el.addEventListener('input', function () { this.classList.remove('error'); });
            el.addEventListener('change', function () { this.classList.remove('error'); });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            /* Basic required-field validation */
            var valid = true;
            contactForm.querySelectorAll('[required]').forEach(function (field) {
                field.classList.remove('error');
                if (!field.value.trim()) {
                    field.classList.add('error');
                    valid = false;
                }
            });
            if (!valid) {
                var firstError = contactForm.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }

            /* Email format validation */
            var emailField = document.getElementById('f-correo');
            var emailRe    = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!emailRe.test(emailField.value.trim())) {
                emailField.classList.add('error');
                emailField.focus();
                return;
            }

            /* Collect params */
            var params = {
                nombre:      document.getElementById('f-nombre').value.trim(),
                correo:      document.getElementById('f-correo').value.trim(),
                whatsapp:    document.getElementById('f-whatsapp').value.trim(),
                objetivo:    document.getElementById('f-objetivo').value,
                dias:        document.getElementById('f-dias').value,
                experiencia: document.getElementById('f-experiencia').value,
                tiempo:      document.getElementById('f-tiempo').value,
                lesiones:    (document.getElementById('f-lesiones').value.trim() || 'Ninguna')
            };

            /* Disable button while sending */
            formBtn.disabled  = true;
            formBtn.innerHTML = 'Enviando\u2026';

            /* If EmailJS is not yet configured, skip send and show success */
            if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                showFormSuccess();
                return;
            }

            Promise.all([
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_OWNER,  params),
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CLIENT, params)
            ])
            .then(function () {
                showFormSuccess();
            })
            .catch(function (err) {
                console.error('EmailJS error:', err);
                formBtn.disabled  = false;
                formBtn.innerHTML = 'Error — Int\u00e9ntalo de nuevo';
                setTimeout(function () {
                    formBtn.disabled  = false;
                    formBtn.innerHTML = BTN_DEFAULT;
                }, 3500);
            });
        });
    }

    function showFormSuccess() {
        if (!contactForm || !formSuccess) return;
        contactForm.hidden  = true;
        formSuccess.hidden  = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

        /* Redirect to WhatsApp after 2.5 s */
        setTimeout(function () {
            window.open(
                'https://wa.me/34677119453?text=Hola%20Ruso%2C%20acabo%20de%20rellenar%20el%20formulario%20de%20RusoFit.',
                '_blank',
                'noopener'
            );
        }, 2500);
    }

}());
