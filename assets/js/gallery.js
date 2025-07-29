/* =============================================
   GALLERY.JS - MASONRY GALLERY & INTERACTIVE FEATURES
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // =========== 1. ANIMATED COUNTERS ===========
    
    const countersSection = document.querySelector('.impact-counters-section');
    const counters = document.querySelectorAll('.counter-number');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const startTime = performance.now();
            const startValue = 0;

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
                
                // Format large numbers with commas
                if (target >= 1000) {
                    counter.textContent = currentValue.toLocaleString();
                } else {
                    counter.textContent = currentValue;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Ensure final value is exactly the target
                    counter.textContent = target >= 1000 ? target.toLocaleString() : target;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    // Intersection Observer for counters
    if (countersSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                }
            });
        }, {
            threshold: 0.5
        });

        counterObserver.observe(countersSection);
    }

    // =========== 2. SEASONAL FILTERING ===========
    
    const seasonTabs = document.querySelectorAll('.season-tab');
    const galleryCards = document.querySelectorAll('.gallery-card');
    const masonryContainer = document.getElementById('masonry-container');

    const filterGallery = (season) => {
        // Add fade out effect
        masonryContainer.style.opacity = '0.3';
        
        setTimeout(() => {
            galleryCards.forEach(card => {
                const cardSeason = card.getAttribute('data-season');
                
                if (season === 'all' || cardSeason === season) {
                    card.style.display = 'block';
                    // Trigger reflow for animation
                    card.offsetHeight;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Fade in effect
            setTimeout(() => {
                masonryContainer.style.opacity = '1';
            }, 150);
        }, 150);
    };

    // Season tab click handlers
    seasonTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const season = this.getAttribute('data-season');
            
            // Update active tab
            seasonTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery
            filterGallery(season);
        });
    });

    // =========== 3. ZOOM/PAN LIGHTBOX FUNCTIONALITY ===========
    
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-image-title');
    const lightboxMeta = document.getElementById('lightbox-image-meta');
    const lightboxClose = document.getElementById('lightbox-close');
    const imageContainer = document.getElementById('image-container');
    const imageCounter = document.getElementById('image-counter');
    
    // Zoom and pan controls
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentImageIndex = 0;
    let currentScale = 1;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    let visibleImages = [];
    
    // Pan functionality
    let isPanning = false;
    let startX, startY, startTranslateX, startTranslateY;

    const updateImageTransform = () => {
        lightboxImage.style.transform = `scale(${currentScale}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
    };

    const resetImageTransform = () => {
        currentScale = 1;
        currentTranslateX = 0;
        currentTranslateY = 0;
        updateImageTransform();
    };

    const openLightbox = (imageElement, index) => {
        const cardInfo = imageElement.closest('.gallery-card').querySelector('.card-info');
        const title = cardInfo ? cardInfo.querySelector('h3').textContent : 'Gallery Image';
        const meta = cardInfo ? cardInfo.querySelector('p').textContent : '';
        
        lightboxTitle.textContent = title;
        lightboxMeta.textContent = meta;
        lightboxImage.src = imageElement.src;
        lightboxImage.alt = imageElement.alt;
        
        currentImageIndex = index;
        resetImageTransform();
        
        // Update counter
        imageCounter.textContent = `${index + 1} / ${visibleImages.length}`;
        
        // Show lightbox
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetImageTransform();
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        const nextImage = visibleImages[currentImageIndex];
        openLightbox(nextImage, currentImageIndex);
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        const prevImage = visibleImages[currentImageIndex];
        openLightbox(prevImage, currentImageIndex);
    };

    // Gallery card click handlers
    const updateVisibleImages = () => {
        visibleImages = Array.from(galleryCards)
            .filter(card => card.style.display !== 'none' && card.querySelector('img'))
            .map(card => card.querySelector('img'));
    };

    galleryCards.forEach((card) => {
        card.addEventListener('click', () => {
            const image = card.querySelector('img');
            if (!image) return; // Skip impact cards without images
            
            updateVisibleImages();
            const imageIndex = visibleImages.indexOf(image);
            if (imageIndex !== -1) {
                openLightbox(image, imageIndex);
            }
        });
    });

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // Zoom controls
    zoomInBtn.addEventListener('click', () => {
        currentScale = Math.min(currentScale * 1.2, 3);
        updateImageTransform();
    });

    zoomOutBtn.addEventListener('click', () => {
        currentScale = Math.max(currentScale / 1.2, 0.5);
        updateImageTransform();
    });

    zoomResetBtn.addEventListener('click', resetImageTransform);

    // Pan functionality
    imageContainer.addEventListener('mousedown', (e) => {
        if (currentScale > 1) {
            isPanning = true;
            startX = e.clientX;
            startY = e.clientY;
            startTranslateX = currentTranslateX;
            startTranslateY = currentTranslateY;
            imageContainer.classList.add('dragging');
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isPanning) {
            const deltaX = (e.clientX - startX) / currentScale;
            const deltaY = (e.clientY - startY) / currentScale;
            currentTranslateX = startTranslateX + deltaX;
            currentTranslateY = startTranslateY + deltaY;
            updateImageTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            imageContainer.classList.remove('dragging');
        }
    });

    // Touch support for mobile
    let touchStartX, touchStartY;
    
    imageContainer.addEventListener('touchstart', (e) => {
        if (currentScale > 1 && e.touches.length === 1) {
            isPanning = true;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            startTranslateX = currentTranslateX;
            startTranslateY = currentTranslateY;
        }
    });

    imageContainer.addEventListener('touchmove', (e) => {
        if (isPanning && e.touches.length === 1) {
            e.preventDefault();
            const deltaX = (e.touches[0].clientX - touchStartX) / currentScale;
            const deltaY = (e.touches[0].clientY - touchStartY) / currentScale;
            currentTranslateX = startTranslateX + deltaX;
            currentTranslateY = startTranslateY + deltaY;
            updateImageTransform();
        }
    });

    imageContainer.addEventListener('touchend', () => {
        isPanning = false;
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case '+':
                case '=':
                    zoomInBtn.click();
                    break;
                case '-':
                    zoomOutBtn.click();
                    break;
                case '0':
                    zoomResetBtn.click();
                    break;
            }
        }
    });

    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // =========== 4. LOAD MORE FUNCTIONALITY ===========
    
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let loadMoreCount = 0;
    
    const additionalImages = [
        {
            src: 'https://picsum.photos/350/400?random=15',
            title: 'Community Workshop',
            meta: 'April 2024 • Spring',
            season: 'spring',
            size: 'medium'
        },
        {
            src: 'https://picsum.photos/300/500?random=16',
            title: 'Environmental Awareness',
            meta: 'August 2024 • Monsoon',
            season: 'monsoon',
            size: 'large'
        },
        {
            src: 'https://picsum.photos/400/300?random=17',
            title: 'Winter Festival',
            meta: 'January 2024 • Winter',
            season: 'winter',
            size: 'small'
        },
        // Add more as needed
    ];

    const loadMoreImages = () => {
        const startIndex = loadMoreCount * 3;
        const endIndex = Math.min(startIndex + 3, additionalImages.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const imageData = additionalImages[i];
            const cardHTML = `
                <div class="gallery-card card-${imageData.size}" data-season="${imageData.season}" data-year="2024">
                    <img src="${imageData.src}" alt="${imageData.title}" loading="lazy">
                    <div class="card-overlay">
                        <div class="card-info">
                            <h3>${imageData.title}</h3>
                            <p>${imageData.meta}</p>
                        </div>
                    </div>
                </div>
            `;
            
            masonryContainer.insertAdjacentHTML('beforeend', cardHTML);
        }
        
        loadMoreCount++;
        
        // Hide button if no more images
        if (endIndex >= additionalImages.length) {
            loadMoreBtn.style.display = 'none';
        }
        
        // Re-attach event listeners to new cards
        const newCards = masonryContainer.querySelectorAll('.gallery-card:not([data-listener])');
        newCards.forEach(card => {
            card.setAttribute('data-listener', 'true');
            card.addEventListener('click', () => {
                const image = card.querySelector('img');
                if (!image) return;
                
                updateVisibleImages();
                const imageIndex = visibleImages.indexOf(image);
                if (imageIndex !== -1) {
                    openLightbox(image, imageIndex);
                }
            });
        });
    };

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreImages);
    }

    // =========== 5. SCROLL ANIMATIONS ===========
    
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.gallery-card');
        const windowHeight = window.innerHeight;
        
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            
            if (cardTop < windowHeight - 100) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial setup for scroll animations
    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Trigger animations on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial call to animate visible cards
    setTimeout(animateOnScroll, 100);

    // Initialize visible images array
    updateVisibleImages();
    
    console.log('🎨 Gallery functionality initialized');
});