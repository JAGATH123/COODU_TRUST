/* =============================================
   MAIN.JS - COODU TRUST WEBSITE
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // =========== 1. MOBILE NAVIGATION & DROPDOWNS ===========
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown > a');
    const MOBILE_NAV_MAX = 1024; // drawer is active at/below this width

    if (hamburger && navMenu) {
        // --- Build drawer chrome once: green header (Menu + close) + pinned Donate ---
        const donateBtn = document.querySelector('.donate-button');
        const donateHref = donateBtn ? (donateBtn.getAttribute('href') || 'donate.html') : 'donate.html';

        const head = document.createElement('li');
        head.className = 'drawer-head';
        head.innerHTML = '<span class="drawer-title">Menu</span>' +
            '<button type="button" class="drawer-close" aria-label="Close menu">✕</button>';
        navMenu.insertBefore(head, navMenu.firstChild);

        const foot = document.createElement('li');
        foot.className = 'drawer-foot';
        foot.innerHTML = '<a class="btn" href="' + donateHref + '">Donate Now</a>';
        navMenu.appendChild(foot);

        const backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        // Append INTO .header so the backdrop shares the drawer's stacking context
        // (sticky .header creates one). A body-level backdrop would paint above the
        // drawer and steal its link taps.
        (document.querySelector('.header') || document.body).appendChild(backdrop);

        // --- a11y: the hamburger is a <div> in markup; make it a real control ---
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('aria-label', 'Open menu');
        hamburger.setAttribute('aria-expanded', 'false');

        // Make the rest of the page non-interactive while the drawer is open (a11y).
        const setInert = (on) => {
            [...document.body.children].forEach(el => {
                if (el.classList.contains('header') || el.tagName === 'SCRIPT') return;
                if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
            });
        };
        const openDrawer = () => {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            backdrop.classList.add('active');
            document.body.classList.add('nav-open');
            hamburger.setAttribute('aria-expanded', 'true');
            setInert(true);
            const closeBtn = head.querySelector('.drawer-close');
            if (closeBtn) closeBtn.focus();
        };
        const closeDrawer = () => {
            const hadFocusInside = document.activeElement && navMenu.contains(document.activeElement);
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            backdrop.classList.remove('active');
            document.body.classList.remove('nav-open');
            hamburger.setAttribute('aria-expanded', 'false');
            setInert(false);
            if (hadFocusInside) hamburger.focus();
        };
        const toggleDrawer = () => navMenu.classList.contains('active') ? closeDrawer() : openDrawer();

        hamburger.addEventListener('click', toggleDrawer);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDrawer(); }
        });
        head.querySelector('.drawer-close').addEventListener('click', closeDrawer);
        backdrop.addEventListener('click', closeDrawer);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
        window.addEventListener('resize', () => { if (window.innerWidth > MOBILE_NAV_MAX) closeDrawer(); });

        // Trap Tab focus inside the open drawer
        navMenu.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || !navMenu.classList.contains('active')) return;
            const focusable = [...navMenu.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.offsetParent !== null);
            if (!focusable.length) return;
            const first = focusable[0], last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        });

        // Close the drawer when a real navigation link (non-accordion parent) is tapped
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            if (!link.parentElement.classList.contains('dropdown')) {
                link.addEventListener('click', closeDrawer);
            }
        });
        foot.querySelector('.btn').addEventListener('click', closeDrawer);

        // --- Programs / Get Involved accordion (level 1) ---
        dropdowns.forEach(dropdownLink => {
            dropdownLink.addEventListener('click', function (e) {
                if (window.innerWidth <= MOBILE_NAV_MAX) {
                    e.preventDefault();
                    this.parentElement.classList.toggle('open');
                }
            });
        });

        // --- Category accordion (level 2: sub-links under a category) ---
        document.querySelectorAll('.dropdown-submenu > a').forEach(submenuLink => {
            submenuLink.addEventListener('click', function (e) {
                if (window.innerWidth <= MOBILE_NAV_MAX) {
                    e.preventDefault();
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

    // =========== 3. DOCUMENTS PAGE FILTERING ===========

    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sidebarSublinks = document.querySelectorAll('.sidebar-sublink');
    const resourceCards = document.querySelectorAll('.resource-card');

    if ((sidebarLinks.length > 0 || sidebarSublinks.length > 0) && resourceCards.length > 0) {
        
        // Handle main sidebar links
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const filter = this.getAttribute('data-filter');

                // Remove active class from all links and sublinks
                sidebarLinks.forEach(s_link => s_link.classList.remove('active'));
                sidebarSublinks.forEach(s_link => s_link.classList.remove('active'));
                this.classList.add('active');

                // Filter cards
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

        // Handle sidebar sublinks
        sidebarSublinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const filter = this.getAttribute('data-filter');

                // Remove active class from all links and sublinks
                sidebarLinks.forEach(s_link => s_link.classList.remove('active'));
                sidebarSublinks.forEach(s_link => s_link.classList.remove('active'));
                this.classList.add('active');

                // Filter cards
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

    // =========== 7. STORIES OF TRANSFORMATION CAROUSEL ===========
    
    const storySlides = document.querySelectorAll('.story-slide');
    const storyDots = document.querySelectorAll('.carousel-dot');
    const storyPrevBtn = document.querySelector('.carousel-prev');
    const storyNextBtn = document.querySelector('.carousel-next');
    let currentStorySlide = 0;
    let storyInterval;

    if (storySlides.length > 0 && storyDots.length > 0) {
        
        // Function to show specific story slide
        const showStorySlide = (index) => {
            // Remove active class from all slides and dots
            storySlides.forEach(slide => slide.classList.remove('active'));
            storyDots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current slide and dot
            storySlides[index].classList.add('active');
            storyDots[index].classList.add('active');
            
            currentStorySlide = index;
        };

        // Function to go to next story slide
        const nextStorySlide = () => {
            currentStorySlide = (currentStorySlide + 1) % storySlides.length;
            showStorySlide(currentStorySlide);
        };

        // Function to go to previous story slide
        const prevStorySlide = () => {
            currentStorySlide = (currentStorySlide - 1 + storySlides.length) % storySlides.length;
            showStorySlide(currentStorySlide);
        };

        // Auto slideshow - change every 6 seconds
        const startStorySlideshow = () => {
            storyInterval = setInterval(nextStorySlide, 6000);
        };

        // Stop slideshow
        const stopStorySlideshow = () => {
            clearInterval(storyInterval);
        };

        // Dot click handlers
        storyDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showStorySlide(index);
                stopStorySlideshow();
                startStorySlideshow(); // Restart the timer
            });
        });

        // Arrow button handlers
        if (storyNextBtn) {
            storyNextBtn.addEventListener('click', () => {
                nextStorySlide();
                stopStorySlideshow();
                startStorySlideshow(); // Restart the timer
            });
        }

        if (storyPrevBtn) {
            storyPrevBtn.addEventListener('click', () => {
                prevStorySlide();
                stopStorySlideshow();
                startStorySlideshow(); // Restart the timer
            });
        }

        // Pause slideshow on hover
        const storiesCarousel = document.querySelector('.stories-carousel');
        if (storiesCarousel) {
            storiesCarousel.addEventListener('mouseenter', stopStorySlideshow);
            storiesCarousel.addEventListener('mouseleave', startStorySlideshow);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.querySelector('.stories-carousel-section:hover')) {
                if (e.key === 'ArrowRight') {
                    nextStorySlide();
                    stopStorySlideshow();
                    startStorySlideshow();
                } else if (e.key === 'ArrowLeft') {
                    prevStorySlide();
                    stopStorySlideshow();
                    startStorySlideshow();
                }
            }
        });

        // Start the story slideshow
        startStorySlideshow();
    }

    // =========== CONTACT FORM HANDLING ===========
    const contactForm = document.querySelector('.contact-form');
    console.log('Contact form found:', !!contactForm);
    
    if (contactForm) {
        console.log('Attaching contact form handler...');
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"], input[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent || submitBtn.value : 'Send Message';
            
            try {
                // Show loading state
                if (submitBtn) {
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                }
                
                // Get form data
                const formData = new FormData(contactForm);
                const contactData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone') || '',
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    inquiryType: formData.get('inquiryType') || 'general'
                };
                
                console.log('Sending contact data:', contactData);
                
                // Submit to API
                const response = await fetch('http://localhost:3000/api/contact/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(contactData)
                });
                
                const result = await response.json();
                console.log('API Response Status:', response.status);
                console.log('API Response Body:', result);
                
                if (response.ok) {
                    // Success
                    console.log('✅ SUCCESS: Message sent successfully!');
                    showNotification('success', 'Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                } else {
                    // Error from API
                    console.log('❌ API Error:', result);
                    if (result.errors) {
                        console.log('Validation Errors:', result.errors);
                        result.errors.forEach(error => {
                            console.log(`- ${error.path}: ${error.msg} (value: "${error.value}")`);
                        });
                    }
                    throw new Error(result.message || 'Failed to send message');
                }
                
            } catch (error) {
                console.error('Contact form error:', error);
                showNotification('error', 'Failed to send message. Please try again or contact us directly.');
            } finally {
                // Reset button state
                if (submitBtn) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
    
    // Notification helper function
    function showNotification(type, message) {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-family: var(--font-family);
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Set colors based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else {
            notification.style.backgroundColor = '#dc3545';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

});
