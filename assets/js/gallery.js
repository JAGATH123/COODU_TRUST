/* =============================================
   GALLERY.JS - SIMPLIFIED GALLERY FUNCTIONALITY
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // =========== 1. GALLERY FILTERING ===========
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        
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
    }

    // =========== 2. SIMPLE LIGHTBOX FUNCTIONALITY ===========

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    let currentImageIndex;

    const openLightbox = (index, visibleItems) => {
        lightbox.style.display = 'flex';
        const imgElement = visibleItems[index].querySelector('img');
        const titleElement = visibleItems[index].querySelector('.gallery-title');
        lightboxImg.src = imgElement.src;
        lightboxCaption.textContent = titleElement ? titleElement.textContent : '';
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
            // Find the index among the currently visible items
            const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
            const visibleIndex = visibleItems.indexOf(item);
            openLightbox(visibleIndex, visibleItems);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

    // Close lightbox on clicking the background
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    console.log('🎨 Gallery functionality initialized');
});