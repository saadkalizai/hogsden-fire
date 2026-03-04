// =============================================================================
// HOGSDEN FIRE - COMPLETE JAVASCRIPT
// Handles all animations and interactions for the entire website
// =============================================================================

(function() {
    'use strict';

    // =============================================================================
    // UTILITY FUNCTIONS
    // =============================================================================

    /**
     * Detect if device is mobile/touch
     */
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };

    const isTouch = isTouchDevice();

    /**
     * Safely query selector with error handling
     */
    const safeQuery = (selector) => {
        try {
            return document.querySelector(selector);
        } catch (e) {
            return null;
        }
    };

    /**
     * Safely query all with error handling
     */
    const safeQueryAll = (selector) => {
        try {
            return document.querySelectorAll(selector);
        } catch (e) {
            return [];
        }
    };

    // =============================================================================
    // HERO SECTION - JIGSAW ANIMATION
    // =============================================================================

const initHeroAnimation = () => {
    const introVideo = safeQuery('.intro-video');
    const logoContainer = safeQuery('.logo-container');
    const logoCarousel = safeQuery('.logo-carousel');

    if (!introVideo || !logoContainer) return;

    // When video ends (8 seconds)
    introVideo.addEventListener('ended', () => {
        // Fade out video to black
        introVideo.classList.add('fade-out');
        
        // Show logo after video fades out
        setTimeout(() => {
            logoContainer.classList.add('show');
            
            // Show carousel 1 second after logo appears
            setTimeout(() => {
                if (logoCarousel) {
                    logoCarousel.classList.add('visible');
                }
            }, 1000);
        }, 500);
    });
};

// =============================================================================
    // ABOUT US SECTION - IMAGE ANIMATION
    // =============================================================================

    const initAboutSection = () => {
        const aboutImage = safeQuery('.about-image');
        const imageWrapper = safeQuery('.about-image-wrapper');
        
        if (!aboutImage || !imageWrapper) return;

        const img = imageWrapper.querySelector('img');

        // Remove loading class when image is loaded
        if (img) {
            img.addEventListener('load', function() {
                imageWrapper.classList.remove('loading');
            });

            // If image is already cached and loaded
            if (img.complete) {
                imageWrapper.classList.remove('loading');
            }
        }

        // Intersection Observer for scroll animation
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        aboutImage.classList.add('visible');
                        observer.unobserve(entry.target); // Only animate once
                    }
                });
            }, observerOptions);

            observer.observe(aboutImage);
        } else {
            // Fallback for older browsers
            aboutImage.classList.add('visible');
        }

        // Desktop-only parallax effect
        if (!isTouch && window.innerWidth > 900) {
            window.addEventListener('scroll', () => {
                const rect = aboutImage.getBoundingClientRect();
                const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
                
                if (scrollPercent > 0 && scrollPercent < 1) {
                    const translateY = (scrollPercent - 0.5) * 20;
                    imageWrapper.style.transform = `translateY(${translateY}px)`;
                }
            });
        }

        // Mobile touch feedback
        if (isTouch) {
            imageWrapper.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });

            imageWrapper.addEventListener('touchend', function() {
                this.style.transform = '';
                
                if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                }
            });

            imageWrapper.addEventListener('touchcancel', function() {
                this.style.transform = '';
            });

            // Performance optimization
            imageWrapper.style.willChange = 'transform';
        }
    };

    // =============================================================================
    // SOLUTIONS SECTION - CARD ANIMATIONS
    // =============================================================================

    const initSolutionsSection = () => {
        const cards = safeQueryAll('.solution-card');
        
        if (cards.length === 0) return;

        // Image loading handlers
        cards.forEach(card => {
            const imageWrapper = card.querySelector('.card-image-wrapper');
            const img = imageWrapper?.querySelector('img');
            
            if (img && imageWrapper) {
                img.addEventListener('load', function() {
                    imageWrapper.classList.remove('loading');
                });

                if (img.complete) {
                    imageWrapper.classList.remove('loading');
                }
            }
        });

        // Desktop-only effects
        if (!isTouch) {
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                });

                card.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 30;
                    const rotateY = (centerX - x) / 30;
                    
                    this.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });

                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                });
            });

            // Mouse tracking proximity effect
            const section = safeQuery('.solutions-section');
            if (section) {
                section.addEventListener('mousemove', function(e) {
                    cards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const cardCenterX = rect.left + rect.width / 2;
                        const cardCenterY = rect.top + rect.height / 2;
                        
                        const distanceX = e.clientX - cardCenterX;
                        const distanceY = e.clientY - cardCenterY;
                        
                        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                        
                        if (distance < 300 && !card.matches(':hover')) {
                            const strength = (300 - distance) / 300;
                            const moveX = (distanceX / distance) * strength * 5;
                            const moveY = (distanceY / distance) * strength * 5;
                            
                            card.style.transform = `translate(${moveX}px, ${moveY}px)`;
                        } else if (!card.matches(':hover')) {
                            card.style.transform = '';
                        }
                    });
                });
            }
        }

        // Mobile touch feedback
        if (isTouch) {
            cards.forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                });

                card.addEventListener('touchend', function() {
                    this.style.transform = '';
                    
                    if ('vibrate' in navigator) {
                        navigator.vibrate(10);
                    }
                });

                card.addEventListener('touchcancel', function() {
                    this.style.transform = '';
                });
            });
        }

        // Click animation for all devices
        cards.forEach(card => {
            card.addEventListener('click', function() {
                const icon = this.querySelector('.card-icon');
                if (icon) {
                    icon.style.transform = 'scale(0.9) rotate(5deg)';
                    
                    setTimeout(() => {
                        icon.style.transform = '';
                    }, 200);
                }
            });
        });

        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            cards.forEach(card => {
                observer.observe(card);
            });
        }

        // Performance optimization
        if (isTouch) {
            cards.forEach(card => {
                card.style.willChange = 'transform, opacity';
            });
        }
    };

    // =============================================================================
    // WHY CHOOSE SECTION - FEATURE ITEMS & IMAGE ANIMATION
    // =============================================================================

    const initWhyChooseSection = () => {
        const imageWrapper = safeQuery('.image-wrapper');
        const featureItems = safeQueryAll('.feature-item');

        // Image loading handler
        if (imageWrapper) {
            const img = imageWrapper.querySelector('img');
            
            if (img) {
                img.addEventListener('load', function() {
                    imageWrapper.classList.remove('loading');
                });

                if (img.complete) {
                    imageWrapper.classList.remove('loading');
                }
            }
        }

        // Desktop-only hover effects
        if (!isTouch && featureItems.length > 0) {
            featureItems.forEach((item, index) => {
                item.addEventListener('mouseenter', function() {
                    featureItems.forEach((otherItem, otherIndex) => {
                        if (otherIndex !== index) {
                            otherItem.style.opacity = '0.6';
                        }
                    });
                });

                item.addEventListener('mouseleave', function() {
                    featureItems.forEach(otherItem => {
                        otherItem.style.opacity = '1';
                    });
                });
            });

            // Parallax effect on image
            const imageContent = safeQuery('.image-content');
            if (imageContent && imageWrapper) {
                window.addEventListener('scroll', function() {
                    const rect = imageContent.getBoundingClientRect();
                    const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
                    
                    if (scrollPercent > 0 && scrollPercent < 1) {
                        const translateY = (scrollPercent - 0.5) * 30;
                        imageWrapper.style.transform = `translateY(${translateY}px)`;
                    }
                });
            }
        }

        // Mobile touch feedback
        if (isTouch && featureItems.length > 0) {
            featureItems.forEach(item => {
                item.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                });

                item.addEventListener('touchend', function() {
                    this.style.transform = '';
                    
                    if ('vibrate' in navigator) {
                        navigator.vibrate(10);
                    }
                });

                item.addEventListener('touchcancel', function() {
                    this.style.transform = '';
                });
            });
        }

        // Click animation for all devices
        featureItems.forEach(item => {
            item.addEventListener('click', function() {
                const icon = this.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'scale(0.9) rotate(-5deg)';
                    
                    setTimeout(() => {
                        icon.style.transform = '';
                    }, 200);
                }
            });
        });

        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window && featureItems.length > 0) {
            const observerOptions = {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            featureItems.forEach(item => {
                observer.observe(item);
            });
        }

        // Badge pulse animation
        const badge = safeQuery('.resistance-badge');
        if (badge) {
            setInterval(() => {
                badge.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    badge.style.transform = 'scale(1)';
                }, 300);
            }, 3000);
        }

        // Performance optimization
        if (isTouch && featureItems.length > 0) {
            featureItems.forEach(item => {
                item.style.willChange = 'transform';
            });
        }
    };

    // =============================================================================
    // PROCESS SECTION - STEP ANIMATIONS
    // =============================================================================

    const initProcessSection = () => {
        const stepItems = safeQueryAll('.step-item');
        
        if (stepItems.length === 0) return;

        // Desktop-only effects
        if (!isTouch) {
            // Sequential highlight effect on scroll
            if ('IntersectionObserver' in window) {
                const observerOptions = {
                    threshold: 0.3,
                    rootMargin: '0px'
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                }, observerOptions);

                stepItems.forEach(item => {
                    observer.observe(item);
                });
            }

            // Add stagger effect on hover
            stepItems.forEach((item, index) => {
                item.addEventListener('mouseenter', function() {
                    stepItems.forEach((otherItem, otherIndex) => {
                        if (otherIndex !== index) {
                            otherItem.style.opacity = '0.6';
                        }
                    });
                });

                item.addEventListener('mouseleave', function() {
                    stepItems.forEach(otherItem => {
                        otherItem.style.opacity = '1';
                    });
                });
            });
        }

        // Mobile touch feedback
        if (isTouch) {
            stepItems.forEach(item => {
                item.addEventListener('touchstart', function() {
                    const iconWrapper = this.querySelector('.step-icon-wrapper');
                    const card = this.querySelector('.step-card');
                    if (iconWrapper) iconWrapper.style.transform = 'scale(1.05)';
                    if (card) card.style.transform = 'translateY(-5px)';
                });

                item.addEventListener('touchend', function() {
                    const iconWrapper = this.querySelector('.step-icon-wrapper');
                    const card = this.querySelector('.step-card');
                    if (iconWrapper) iconWrapper.style.transform = '';
                    if (card) card.style.transform = '';
                    
                    if ('vibrate' in navigator) {
                        navigator.vibrate(10);
                    }
                });

                item.addEventListener('touchcancel', function() {
                    const iconWrapper = this.querySelector('.step-icon-wrapper');
                    const card = this.querySelector('.step-card');
                    if (iconWrapper) iconWrapper.style.transform = '';
                    if (card) card.style.transform = '';
                });
            });
        }

        // Click animation for step items
        stepItems.forEach(item => {
            item.addEventListener('click', function() {
                const icon = this.querySelector('.step-icon-wrapper');
                if (icon) {
                    icon.style.transform = 'scale(0.95) rotate(5deg)';
                    
                    setTimeout(() => {
                        icon.style.transform = '';
                    }, 200);
                }
            });
        });

        // Performance optimization
        if (isTouch) {
            stepItems.forEach(item => {
                item.style.willChange = 'transform, opacity';
            });
        }
    };

    // =============================================================================
    // CTA SECTION - BUTTON ANIMATIONS
    // =============================================================================

    const initCTASection = () => {
        const ctaButton = safeQuery('.cta-button');
        const ctaContent = safeQuery('.cta-content');

        if (!ctaButton) return;

        // Desktop hover effects
        if (!isTouch) {
            ctaButton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
            });

            ctaButton.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });

            // Parallax effect on decorative elements
            const circleDecoration = safeQuery('.circle-decoration');
            if (circleDecoration) {
                document.addEventListener('mousemove', function(e) {
                    const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
                    const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
                    
                    circleDecoration.style.transform = `translateY(-50%) translate(${moveX}px, ${moveY}px)`;
                });
            }
        }

        // Mobile touch feedback
        if (isTouch) {
            ctaButton.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });

            ctaButton.addEventListener('touchend', function() {
                this.style.transform = '';
                
                if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                }
            });

            ctaButton.addEventListener('touchcancel', function() {
                this.style.transform = '';
            });
        }

        // Intersection Observer for animation
        if ('IntersectionObserver' in window && ctaContent) {
            const observerOptions = {
                threshold: 0.3,
                rootMargin: '0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            observer.observe(ctaContent);
        }

        // Add ripple effect on click
        ctaButton.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });

        // Performance optimization
        if (isTouch) {
            ctaButton.style.willChange = 'transform';
        }
    };

    // =============================================================================
    // GLOBAL EVENT HANDLERS
    // =============================================================================

    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            window.scrollTo(0, window.scrollY);
        }, 100);
    });

    // Add CSS for ripple animation if not already present
    const addRippleStyles = () => {
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // =============================================================================
    // INITIALIZATION
    // =============================================================================

    /**
     * Initialize all sections when DOM is ready
     */
    const init = () => {
        addRippleStyles();
        initHeroAnimation();
        initAboutSection();
        initSolutionsSection();
        initWhyChooseSection();
        initProcessSection();
        initCTASection();
    };

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }

    // Also initialize on window load for hero section
    window.addEventListener('load', initHeroAnimation);

})();