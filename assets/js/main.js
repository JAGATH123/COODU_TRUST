/* =============================================
   MAIN.JS - COODU TRUST WEBSITE
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // =========== 1. MOBILE NAVIGATION & DROPDOWNS ===========
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown > a');

    if (hamburger && navMenu) {
        // Toggles the main hamburger menu open and closed
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Closes the menu if a non-dropdown link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            if (!link.parentElement.classList.contains('dropdown')) {
                link.addEventListener('click', () => {
                    if (hamburger.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                });
            }
        });

        // Handles the dropdown functionality specifically for mobile view
        dropdowns.forEach(dropdownLink => {
            dropdownLink.addEventListener('click', function(e) {
                // Check if we are in mobile view (hamburger is visible)
                if (window.innerWidth <= 1200) {
                    e.preventDefault(); // Prevent link from navigating
                    const dropdownMenu = this.nextElementSibling;
                    
                    // Toggle the 'show' class to display or hide the dropdown
                    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
                    
                    // Optional: add a class to the parent for styling the arrow
                    this.parentElement.classList.toggle('open');
                }
            });
        });
    }

    // =========== 2. LIVE STATISTICS COUNTER ANIMATION ===========

    const statsSection = document.getElementById('stats-banner');
    const counters = document.querySelectorAll('.stat-number');
    
    if (statsSection && counters.length > 0) {
        const animationSpeed = 200;

        const animateCounters = () => {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText.replace(/,/g, '');

                    const increment = target / animationSpeed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 15);
                    } else {
                        if (target % 1 !== 0) {
                           counter.innerText = target.toFixed(2);
                        } else {
                           counter.innerText = target.toLocaleString();
                        }
                    }
                };
                updateCount();
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(statsSection);
                }
            });
        }, {
            threshold: 0.5
        });

        observer.observe(statsSection);
    }

    // =========== 3. RESOURCES PAGE FILTERING ===========

    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const resourceCards = document.querySelectorAll('.resource-card');

    if (sidebarLinks.length > 0 && resourceCards.length > 0) {
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const filter = this.getAttribute('data-filter');

                sidebarLinks.forEach(s_link => s_link.classList.remove('active'));
                this.classList.add('active');

                resourceCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // =========== 4. DONATION PAGE TABS & AMOUNT SELECTION ===========
    
    const donationTabs = document.querySelectorAll('.tab-link');
    const donationContents = document.querySelectorAll('.tab-content');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');

    if (donationTabs.length > 0) {
        // Tab functionality
        donationTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                donationTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                donationContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Amount buttons functionality
        amountButtons.forEach(button => {
            button.addEventListener('click', function() {
                amountButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                if (customAmountInput) {
                    customAmountInput.value = '';
                }
            });
        });

        if (customAmountInput) {
            customAmountInput.addEventListener('focus', function() {
                amountButtons.forEach(btn => btn.classList.remove('active'));
            });
        }
    }
    
    // =========== 5. GALLERY PAGE FILTERING & LIGHTBOX ===========

    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');

    if (filterButtons.length > 0 && galleryItems.length > 0 && lightbox) {
        
        // Gallery Filtering
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Lightbox functionality
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        let currentImageIndex;

        const openLightbox = (index, visibleItems) => {
            lightbox.style.display = 'flex';
            const imgElement = visibleItems[index].querySelector('img');
            lightboxImg.src = imgElement.src;
            lightboxCaption.textContent = imgElement.getAttribute('data-title');
            currentImageIndex = index;
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
        };

        const showNextImage = () => {
            const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
            currentImageIndex = (currentImageIndex + 1) % visibleItems.length;
            openLightbox(currentImageIndex, visibleItems);
        };

        const showPrevImage = () => {
            const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
            currentImageIndex = (currentImageIndex - 1 + visibleItems.length) % visibleItems.length;
            openLightbox(currentImageIndex, visibleItems);
        };

        galleryItems.forEach((item) => {
            item.addEventListener('click', () => {
                // We need to find the index among the currently visible items
                const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
                const visibleIndex = visibleItems.indexOf(item);
                openLightbox(visibleIndex, visibleItems);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);

        // Close lightbox on clicking the background
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation for lightbox
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowRight') {
                    showNextImage();
                } else if (e.key === 'ArrowLeft') {
                    showPrevImage();
                } else if (e.key === 'Escape') {
                    closeLightbox();
                }
            }
        });
    }

});
