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

    // =========== 2. LIVE STATISTICS REAL-TIME COUNTERS ===========

    const statsSection = document.getElementById('stats-banner');
    const counters = document.querySelectorAll('.stat-number');
    
    if (statsSection && counters.length > 0) {
        // Define starting values and increment rates per second (based on real global statistics)
        const statsConfig = [
            {
                element: counters[0], // World population
                startValue: 8192242010,
                incrementPerSecond: 2.3, // births - deaths per second globally
                formatter: (value) => Math.floor(value).toLocaleString()
            },
            {
                element: counters[1], // Tonnes of waste dumped
                startValue: 1198948812,
                incrementPerSecond: 64, // ~2.01 billion tonnes per year
                formatter: (value) => Math.floor(value).toLocaleString()
            },
            {
                element: counters[2], // Tonnes of electronic waste
                startValue: 28277094,
                incrementPerSecond: 1.7, // ~54 million tonnes per year
                formatter: (value) => Math.floor(value).toLocaleString()
            },
            {
                element: counters[3], // Number of Earths humanity uses
                startValue: 1.72,
                incrementPerSecond: 0.000000032, // Very slow increase
                formatter: (value) => value.toFixed(2)
            }
        ];

        let isVisible = false;
        let statsInterval;

        const startLiveCounters = () => {
            if (isVisible) return; // Prevent multiple intervals
            isVisible = true;

            // First: Animate from 0 to starting values (initial animation)
            const animationSpeed = 200;
            let animationsCompleted = 0;

            statsConfig.forEach((stat, index) => {
                stat.currentValue = 0;
                stat.element.textContent = "0";

                const animateToStart = () => {
                    const increment = stat.startValue / animationSpeed;
                    
                    const updateAnimation = () => {
                        if (stat.currentValue < stat.startValue) {
                            stat.currentValue += increment;
                            if (stat.currentValue > stat.startValue) {
                                stat.currentValue = stat.startValue;
                            }
                            stat.element.textContent = stat.formatter(stat.currentValue);
                            setTimeout(updateAnimation, 15);
                        } else {
                            // Animation completed
                            stat.currentValue = stat.startValue;
                            stat.element.textContent = stat.formatter(stat.currentValue);
                            animationsCompleted++;
                            
                            // When all animations are done, start live counters
                            if (animationsCompleted === statsConfig.length) {
                                startLiveIncrements();
                            }
                        }
                    };
                    updateAnimation();
                };
                
                animateToStart();
            });
        };

        const startLiveIncrements = () => {
            // Now start the live real-time increments
            statsInterval = setInterval(() => {
                statsConfig.forEach(stat => {
                    stat.currentValue += stat.incrementPerSecond;
                    stat.element.textContent = stat.formatter(stat.currentValue);
                });
            }, 1000);
        };

        const stopLiveCounters = () => {
            if (statsInterval) {
                clearInterval(statsInterval);
                statsInterval = null;
            }
        };

        // Use Intersection Observer to start counters when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startLiveCounters();
                } else {
                    // Optional: stop counters when not visible to save resources
                    // stopLiveCounters();
                    // isVisible = false;
                }
            });
        }, {
            threshold: 0.5
        });

        observer.observe(statsSection);

        // Stop counters when page is hidden (browser tab inactive)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopLiveCounters();
            } else if (isVisible) {
                startLiveCounters();
            }
        });
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

    // =========== 6. HERO SLIDESHOW FUNCTIONALITY ===========
    
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;

    if (heroSlides.length > 0 && heroDots.length > 0) {
        
        // Function to show specific slide
        const showSlide = (index) => {
            // Remove active class from all slides and dots
            heroSlides.forEach(slide => slide.classList.remove('active'));
            heroDots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current slide and dot
            heroSlides[index].classList.add('active');
            heroDots[index].classList.add('active');
            
            currentSlide = index;
        };

        // Function to go to next slide
        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % heroSlides.length;
            showSlide(currentSlide);
        };

        // Auto slideshow - change every 5 seconds
        const startSlideshow = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };

        // Stop slideshow
        const stopSlideshow = () => {
            clearInterval(slideInterval);
        };

        // Dot click handlers
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopSlideshow();
                startSlideshow(); // Restart the timer
            });
        });

        // Pause slideshow on hover
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopSlideshow);
            heroSection.addEventListener('mouseleave', startSlideshow);
        }

        // Start the slideshow
        startSlideshow();
    }

});
