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

    // =========== 2. iOS GLASSMORPHISM MODAL FUNCTIONALITY ===========

    const glassModal = document.getElementById('lightbox');
    const glassImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.glass-close-btn');
    const prevBtn = document.querySelector('.glass-prev');
    const nextBtn = document.querySelector('.glass-next');
    
    // Content elements
    const glassCategory = document.getElementById('glass-category');
    const glassTitle = document.getElementById('glass-title');
    const glassDescription = document.getElementById('glass-description');
    const glassLocation = document.getElementById('glass-location');
    const glassDate = document.getElementById('glass-date');
    const glassImpact = document.getElementById('glass-impact');
    const glassStory = document.getElementById('glass-story');
    const glassTags = document.getElementById('glass-tags');
    
    let currentImageIndex;

    const openGlassModal = (index, visibleItems) => {
        const item = visibleItems[index];
        const imgElement = item.querySelector('img');
        
        // Set image
        glassImg.src = imgElement.src;
        glassImg.alt = imgElement.alt;
        
        // Get data from attributes
        const category = item.getAttribute('data-category') || 'General';
        const title = item.getAttribute('data-title') || item.querySelector('.gallery-title')?.textContent || 'Untitled';
        const description = item.getAttribute('data-description') || item.querySelector('.gallery-description')?.textContent || '';
        const location = item.getAttribute('data-location') || 'Various Locations';
        const date = item.getAttribute('data-date') || 'Ongoing';
        const impact = item.getAttribute('data-impact') || 'Making a difference';
        const story = item.getAttribute('data-story') || 'This initiative represents our commitment to positive change in communities.';
        const tags = item.getAttribute('data-tags') || '';
        
        // Populate content
        glassCategory.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        glassTitle.textContent = title;
        glassDescription.textContent = description;
        glassLocation.textContent = location;
        glassDate.textContent = date;
        glassImpact.textContent = impact;
        glassStory.textContent = story;
        
        // Create tags
        if (tags) {
            const tagArray = tags.split(',');
            glassTags.innerHTML = '';
            tagArray.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'glass-tag';
                tagElement.textContent = tag.trim();
                glassTags.appendChild(tagElement);
            });
        } else {
            glassTags.innerHTML = '';
        }
        
        // Show modal with animation
        glassModal.style.display = 'flex';
        setTimeout(() => {
            glassModal.classList.add('active');
        }, 10);
        
        currentImageIndex = index;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    };

    const closeGlassModal = () => {
        glassModal.classList.remove('active');
        setTimeout(() => {
            glassModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    };

    const showNextImage = () => {
        const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
        currentImageIndex = (currentImageIndex + 1) % visibleItems.length;
        openGlassModal(currentImageIndex, visibleItems);
    };

    const showPrevImage = () => {
        const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
        currentImageIndex = (currentImageIndex - 1 + visibleItems.length) % visibleItems.length;
        openGlassModal(currentImageIndex, visibleItems);
    };

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            // Find the index among the currently visible items
            const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
            const visibleIndex = visibleItems.indexOf(item);
            openGlassModal(visibleIndex, visibleItems);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeGlassModal);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

    // Close modal on clicking the backdrop
    if (glassModal) {
        glassModal.addEventListener('click', (e) => {
            if (e.target === glassModal || e.target.classList.contains('glass-modal-backdrop')) {
                closeGlassModal();
            }
        });
    }
    
    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (glassModal && glassModal.classList.contains('active')) {
            if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'Escape') {
                closeGlassModal();
            }
        }
    });

    console.log('🎨 Gallery functionality initialized');
});