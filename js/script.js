/* ═══════════════════════════════════════════════════════
   ALIAGUI HOME — Interactive Engine
   ═══════════════════════════════════════════════════════
   Handles:
   • Scroll-based reveal animations (IntersectionObserver)
   • Animated counters
   • Testimonial carousel with auto-play
   • FAQ accordion
   • Header shrink on scroll
   • Mobile menu
   • Parallax effects
   • Marquee pause on hover
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────────
       1. HEADER — Shrink on Scroll
       ───────────────────────────────────────────── */
    const header = document.querySelector('.site-header');
    if (header) {
        let lastScroll = 0;
        const SCROLL_THRESHOLD = 40;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > SCROLL_THRESHOLD) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }


    /* ─────────────────────────────────────────────
       2. MOBILE MENU
       ───────────────────────────────────────────── */
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            if (isOpen) {
                menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
                menuBtn.setAttribute('aria-expanded', 'true');
            } else {
                menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }


    /* ─────────────────────────────────────────────
       3. SCROLL REVEAL — IntersectionObserver
       ───────────────────────────────────────────── */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: show everything immediately
        revealElements.forEach(el => el.classList.add('revealed'));
    }


    /* ─────────────────────────────────────────────
       4. ANIMATED COUNTERS
       ───────────────────────────────────────────── */
    const counters = document.querySelectorAll('[data-count]');

    if (counters.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const prefix = element.getAttribute('data-prefix') || '';
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2200;
        const start = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(easedProgress * target);

            element.textContent = prefix + current.toLocaleString('fr-FR') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = prefix + target.toLocaleString('fr-FR') + suffix;
            }
        }

        requestAnimationFrame(update);
    }


    /* ─────────────────────────────────────────────
       5. TESTIMONIAL CAROUSEL
       ───────────────────────────────────────────── */
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const testimonialPrev = document.getElementById('testimonial-prev');
    const testimonialNext = document.getElementById('testimonial-next');

    if (testimonialTrack) {
        let currentSlide = 0;
        const totalSlides = testimonialTrack.children.length;
        let autoPlayInterval;

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentSlide = index;

            testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

            testimonialDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Arrow navigation
        if (testimonialPrev) {
            testimonialPrev.addEventListener('click', () => {
                stopAutoPlay();
                goToSlide(currentSlide - 1);
                startAutoPlay();
            });
        }

        if (testimonialNext) {
            testimonialNext.addEventListener('click', () => {
                stopAutoPlay();
                goToSlide(currentSlide + 1);
                startAutoPlay();
            });
        }

        // Dot navigation
        testimonialDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                stopAutoPlay();
                goToSlide(i);
                startAutoPlay();
            });
        });

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        testimonialTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(currentSlide - 1);
                }
            }
            startAutoPlay();
        }, { passive: true });

        // Initialize
        goToSlide(0);
        startAutoPlay();

        // Pause on hover
        testimonialTrack.closest('.testimonials-wrapper')?.addEventListener('mouseenter', stopAutoPlay);
        testimonialTrack.closest('.testimonials-wrapper')?.addEventListener('mouseleave', startAutoPlay);
    }


    /* ─────────────────────────────────────────────
       6. FAQ ACCORDION
       ───────────────────────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all others
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                }
            });

            // Toggle current
            item.classList.toggle('open', !isOpen);
        });
    });


    /* ─────────────────────────────────────────────
       7. PARALLAX — Subtle on Hero Image
       ───────────────────────────────────────────── */
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length > 0 && window.matchMedia('(min-width: 768px)').matches) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    parallaxElements.forEach(el => {
                        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
                        const rect = el.getBoundingClientRect();
                        const offset = (rect.top + scrollY) - scrollY;
                        el.style.transform = `translateY(${offset * speed * 0.1}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }


    /* ─────────────────────────────────────────────
       8. COLLECTIONS CAROUSEL (legacy support)
       ───────────────────────────────────────────── */
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;

        function getVisibleSlides() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 640) return 2;
            return 1;
        }

        function updateCarouselPosition() {
            const slides = track.children;
            if (slides.length === 0) return;

            const slideWidth = slides[0].getBoundingClientRect().width;
            const gap = 32;
            const moveAmount = currentIndex * (slideWidth + gap);
            track.style.transform = `translateX(-${moveAmount}px)`;
        }

        nextBtn.addEventListener('click', () => {
            const totalSlides = track.children.length;
            const visibleSlides = getVisibleSlides();
            if (currentIndex < totalSlides - visibleSlides) {
                currentIndex++;
                updateCarouselPosition();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarouselPosition();
            }
        });

        window.addEventListener('resize', updateCarouselPosition);
    }


    /* ─────────────────────────────────────────────
       9. CONTACT FORM — WhatsApp Redirect
       ───────────────────────────────────────────── */
    const contactForm = document.getElementById('contact-whatsapp-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name')?.value?.trim() || '';
            const message = document.getElementById('form-message')?.value?.trim() || '';

            if (!name || !message) return;

            const whatsappMessage = encodeURIComponent(
                `Bonjour Aliagui Home,\n\nJe suis ${name}.\n\n${message}`
            );

            window.open(`https://wa.me/2250142789097?text=${whatsappMessage}`, '_blank');
        });
    }


    /* ─────────────────────────────────────────────
       10. PRODUCT DETAIL — Thumbnail Gallery
       ───────────────────────────────────────────── */
    const thumbnails = document.querySelectorAll('.product-thumb');
    const mainProductImage = document.getElementById('main-product-img') || document.querySelector('.product-main-image img');

    if (thumbnails.length > 0 && mainProductImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const newSrc = thumb.querySelector('img')?.getAttribute('data-full') || thumb.querySelector('img')?.src;
                if (newSrc) {
                    mainProductImage.style.opacity = '0';
                    mainProductImage.style.transform = 'scale(0.97)';

                    setTimeout(() => {
                        mainProductImage.src = newSrc;
                        mainProductImage.style.opacity = '1';
                        mainProductImage.style.transform = 'scale(1)';
                    }, 250);

                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                }
            });
        });
    }


    /* ─────────────────────────────────────────────
       11. NEWSLETTER FORM — Visual Feedback
       ───────────────────────────────────────────── */
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('.newsletter-btn');
            const input = newsletterForm.querySelector('.newsletter-input');

            if (btn && input && input.value.trim()) {
                const originalText = btn.textContent;
                btn.textContent = '✓ Merci !';
                btn.style.background = '#2D6A4F';
                input.value = '';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

});
