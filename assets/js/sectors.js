/* =============================================
   SECTORS.JS - INTERACTIVE SECTORS NAVIGATION
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {

    // =========== SECTOR NAVIGATION FUNCTIONALITY ===========
    // Supports 6 sectors: Environment, Agriculture, Women Empowerment, Education, Health/Sanitation/Waste, Consultancy

    const sectorNavButtons = document.querySelectorAll('.program-nav-btn, .sector-nav-btn');
    const sectorSections = document.querySelectorAll('.sector-section');

    // Reveal a sector's program cards. The active sector must never be left at
    // opacity:0 (that caused the program cards to vanish, leaving a tall empty
    // white void where the grid should be).
    const revealSectorCards = (section) => {
        if (!section) return;
        section.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.08}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    };

    if (sectorNavButtons.length > 0 && sectorSections.length > 0) {

        // Function to show specific sector
        const showSector = (sectorId) => {
            // Hide all sections
            sectorSections.forEach(section => section.classList.remove('active'));

            // Show target section
            const targetSection = document.getElementById(sectorId);
            if (targetSection) {
                targetSection.classList.add('active');
                // Always reveal the program cards of the sector we just opened.
                // Cards inside a previously hidden (display:none) section never
                // trigger the IntersectionObserver, so reveal them explicitly.
                revealSectorCards(targetSection);
            }

            // Update navigation buttons
            sectorNavButtons.forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`[data-sector="${sectorId}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }

            // Smooth scroll to section
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        };

        // Add click event listeners to navigation buttons
        sectorNavButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sectorId = this.getAttribute('data-sector');
                showSector(sectorId);
            });
        });

        // Optional: Handle URL hash for direct linking
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(hash)) {
            setTimeout(() => {
                showSector(hash);
            }, 100);
        }
    }

    // =========== PROJECT CARDS ANIMATION ===========

    const projectCards = document.querySelectorAll('.project-card');

    // Cards start VISIBLE so a sector's program grid always renders (the active
    // class is applied after this runs, so an opacity:0 + observer/reveal start
    // state would leave the initial panel's cards hidden below the fold).
    projectCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Reveal the cards of whichever sector is active on initial load, so the
    // first panel renders its full program grid instead of an empty void.
    const initialActiveSection = document.querySelector('.sector-section.active');
    if (initialActiveSection) {
        // Defer one frame so the start state paints first and the fade-in shows.
        requestAnimationFrame(() => revealSectorCards(initialActiveSection));
    }

    // Progressive enhancement: also fade cards in as they scroll into view
    // (covers tall sectors whose lower cards begin below the fold).
    if ('IntersectionObserver' in window) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        projectCards.forEach(card => cardObserver.observe(card));
    } else {
        // No observer support: guarantee nothing stays hidden.
        projectCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }

    // =========== SMOOTH SCROLLING FOR INTERNAL LINKS ===========
    // Note: only same-page anchor links (href="#...") are intercepted here;
    // the program "Learn More" links point to real pages and navigate normally.

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return; // ignore bare "#" links
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('🏗️ Sectors page functionality initialized (6 sectors, program cards linked)');
});
