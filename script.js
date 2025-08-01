// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initMobileMenu();
    initTabSwitching();

    // Visa Pricing Tab Slider
    const tabBar = document.querySelector('.pricing-tabs .tab-buttons');
    if (tabBar) {
        const tabs = tabBar.querySelectorAll('.tab-btn');
        const slider = tabBar.querySelector('.slider');

        let sliderState = {
            left: 0,
            width: 0,
            targetLeft: 0,
            targetWidth: 0,
            animating: false
        };

        function lerp(a, b, n) {
            return a + (b - a) * n;
        }

        function animateSlider() {
            // Animate left and width toward target
            sliderState.left = lerp(sliderState.left, sliderState.targetLeft, 0.2);
            sliderState.width = lerp(sliderState.width, sliderState.targetWidth, 0.2);
            slider.style.left = sliderState.left + 'px';
            slider.style.width = sliderState.width + 'px';
            // If not close enough, keep animating
            if (Math.abs(sliderState.left - sliderState.targetLeft) > 0.5 || Math.abs(sliderState.width - sliderState.targetWidth) > 0.5) {
                requestAnimationFrame(animateSlider);
            } else {
                // Snap to target at the end
                slider.style.left = sliderState.targetLeft + 'px';
                slider.style.width = sliderState.targetWidth + 'px';
                sliderState.left = sliderState.targetLeft;
                sliderState.width = sliderState.targetWidth;
                sliderState.animating = false;
            }
        }

        function moveSliderToTab(tab) {
            const left = tab.offsetLeft;
            const width = tab.offsetWidth;
            sliderState.targetLeft = left;
            sliderState.targetWidth = width;
            if (!sliderState.animating) {
                sliderState.animating = true;
                animateSlider();
            }
        }

        // Initialize slider position
        const activeTab = tabBar.querySelector('.tab-btn.active');
        if (activeTab) {
            sliderState.left = activeTab.offsetLeft;
            sliderState.width = activeTab.offsetWidth;
            sliderState.targetLeft = sliderState.left;
            sliderState.targetWidth = sliderState.width;
            slider.style.left = sliderState.left + 'px';
            slider.style.width = sliderState.width + 'px';
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabBar.querySelector('.tab-btn.active').classList.remove('active');
                tab.classList.add('active');
                moveSliderToTab(tab);
            });
        });

        // Responsive: update slider on window resize
        window.addEventListener('resize', () => {
            const activeTab = tabBar.querySelector('.tab-btn.active');
            if (activeTab) {
                sliderState.left = activeTab.offsetLeft;
                sliderState.width = activeTab.offsetWidth;
                sliderState.targetLeft = sliderState.left;
                sliderState.targetWidth = sliderState.width;
                slider.style.left = sliderState.left + 'px';
                slider.style.width = sliderState.width + 'px';
            }
        });
    }

    const gradientText = document.querySelector('.gradient-move');
    if (gradientText) {
        gradientText.addEventListener('mousemove', function(e) {
            const rect = gradientText.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            gradientText.style.setProperty('--mouse-x', `${x}%`);
            gradientText.style.setProperty('--mouse-y', `${y}%`);
        });
        gradientText.addEventListener('mouseleave', function() {
            gradientText.style.setProperty('--mouse-x', `50%`);
            gradientText.style.setProperty('--mouse-y', `50%`);
        });
    }

});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    
    // Handle navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-up class
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Tab switching functionality
function initTabSwitching() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", function() {
            const targetTab = this.getAttribute("data-tab");
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));
            
            // Add active class to clicked button and corresponding content
            this.classList.add("active");
            document.getElementById(targetTab).classList.add("active");
            
            // Re-trigger animations for newly visible content
            const newContent = document.getElementById(targetTab);
            const animatedElements = newContent.querySelectorAll(".fade-in-up");
            animatedElements.forEach((el, index) => {
                el.style.opacity = "0";
                el.style.transform = "translateY(50px)";
                setTimeout(() => {
                    //redueced animation delay for each element
                    el.style.transition = "all 0.6s ease-out"; 
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                }, index * 100);
            });
        });
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('form-success');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (validateForm(data)) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Hide form and show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    form.style.display = 'block';
                    successMessage.style.display = 'none';
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 5000);
            }, 2000);
        }
    });
}





// Form validation
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!data.service) {
        errors.push('Please select a service');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a detailed message (at least 10 characters)');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form errors
function showFormErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-message form-error';
    errorContainer.style.background = '#F8D7DA';
    errorContainer.style.color = '#721C24';
    errorContainer.style.border = '1px solid #F5C6CB';
    errorContainer.style.padding = '1rem';
    errorContainer.style.borderRadius = '10px';
    errorContainer.style.marginBottom = '1rem';
    
    const errorList = document.createElement('ul');
    errorList.style.margin = '0';
    errorList.style.paddingLeft = '1.5rem';
    
    errors.forEach(error => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorList.appendChild(errorItem);
    });
    
    errorContainer.appendChild(errorList);
    
    // Insert error container at the top of the form
    const form = document.getElementById('contactForm');
    form.insertBefore(errorContainer, form.firstChild);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                const navToggle = document.getElementById('nav-toggle');
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Close menu when window is resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize performance optimizations
initPerformanceOptimizations();

// Add loading animation for buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') && !e.target.disabled) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // Add ripple styles
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .btn { position: relative; overflow: hidden; }
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to { transform: scale(4); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--light-blue), var(--soft-gold));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', debounce(() => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    }, 10));
}

// Initialize scroll progress
addScrollProgress();

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Tab navigation for pricing cards
    if (e.key === 'Tab') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('pricing-card')) {
            focusedElement.style.outline = '2px solid var(--light-blue)';
            setTimeout(() => {
                focusedElement.style.outline = '';
            }, 2000);
        }
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (diff > 0 && navMenu.classList.contains('active')) {
            // Swipe left - close menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
}

// Add error handling for failed image loads
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Failed to load image:', e.target.src);
    }
}, true);

// Add analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Replace with actual analytics implementation
    console.log('Event tracked:', eventName, eventData);
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_class: e.target.className,
            page_url: window.location.href
        });
    }
});

// Track form submissions
document.getElementById('contactForm').addEventListener('submit', function() {
    trackEvent('form_submission', {
        form_id: 'contactForm',
        page_url: window.location.href
    });
});
// ------------------------------------------------------------------------------------
 document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });

// Add print styles support
function addPrintStyles() {
    const printStyles = document.createElement('style');
    printStyles.media = 'print';
    printStyles.textContent = `
        @media print {
            .navbar, .floating-element, .btn { display: none !important; }
            .hero { height: auto !important; padding: 2rem 0; }
            .section-padding { padding: 1rem 0 !important; }
            * { color: black !important; background: white !important; }
            .pricing-card, .service-card, .package-card { 
                break-inside: avoid; 
                border: 1px solid #ccc !important;
                margin-bottom: 1rem;
            }
        }
    `;
    document.head.appendChild(printStyles);
}

addPrintStyles();

// document.addEventListener('DOMContentLoaded', function() {
//     // Ensure the VANTA library is loaded and the target element exists
//     const vantaBg = document.querySelector('.vanta-bg');
//     if (window.VANTA && window.VANTA.CLOUDS2 && vantaBg) {
//         window.VANTA.CLOUDS2({
//             el: vantaBg,
//             mouseControls: true,
//             touchControls: true,
//             gyroControls: true,
//             minHeight: 100.00,
//             minWidth: 100.00,
//             scale: 1,
//             texturePath: "./gallery/noise.png"
//         });
//     } else if (!vantaBg) {
//         console.warn('VANTA background element ".vanta-bg" not found.');
//     }
// });

document.addEventListener("DOMContentLoaded", function() {
  VANTA.CLOUDS({
    el: "#home",
    mouseControls: true,
    touchControls: true,
    minHeight: 200.00,
    minWidth: 200.00
  });
});

// Initialize all functionality when DOM is ready
console.log('Urban Fly Tours website initialized successfully!');

