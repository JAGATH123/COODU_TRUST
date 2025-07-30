/* =============================================
   SECTORS.JS - INTERACTIVE SECTORS NAVIGATION
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // =========== SECTOR NAVIGATION FUNCTIONALITY ===========
    
    const sectorNavButtons = document.querySelectorAll('.sector-nav-btn');
    const sectorSections = document.querySelectorAll('.sector-section');

    if (sectorNavButtons.length > 0 && sectorSections.length > 0) {
        
        // Function to show specific sector
        const showSector = (sectorId) => {
            // Hide all sections
            sectorSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetSection = document.getElementById(sectorId);
            if (targetSection) {
                targetSection.classList.add('active');
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
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const projectCards = document.querySelectorAll('.project-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initialize card animations
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        cardObserver.observe(card);
    });

    // =========== SMOOTH SCROLLING FOR INTERNAL LINKS ===========
    
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('🏗️ Sectors page functionality initialized');
});