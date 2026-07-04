document.addEventListener('DOMContentLoaded', () => {
    // ---- ENCART : GESTION DU MENU MOBILE ----
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isMenuHidden = mobileMenu.classList.toggle('hidden');
            if (!isMenuHidden) {
                menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            } else {
                menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            }
        });
    }

    // ---- ENCART : GESTION DU CARROUSEL ----
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;

        function getVisibleSlides() {
            if (window.innerWidth >= 1024) return 3; // Écrans PC
            if (window.innerWidth >= 640) return 2;  // Tablettes
            return 1;                                // Mobiles
        }

        function updateCarouselPosition() {
            const slides = track.children;
            if (slides.length === 0) return;
            
            const slideWidth = slides[0].getBoundingClientRect().width;
            const gap = 32; // Équivalent au gap-8 de Tailwind (32px)
            
            // Calcul du décalage parfait
            const moveAmount = currentIndex * (slideWidth + gap);
            track.style.transform = `translateX(-${moveAmount}px)`;
        }

        nextBtn.addEventListener('click', () => {
            const totalSlides = track.children.length;
            const visibleSlides = getVisibleSlides();
            
            // Empêche de scroller dans le vide s'il n'y a plus d'images cachées
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

        // Recalcule les tailles à la volée si on redimensionne la fenêtre du navigateur
        window.addEventListener('resize', updateCarouselPosition);
    }
});