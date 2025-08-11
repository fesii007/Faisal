// Main application JavaScript
class PortfolioApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupSkillBars();
        this.setupContactForm();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }
    
    // Navigation functionality
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Add scroll effect to navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Update active nav link based on scroll position
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        });
    }
    
    // Mobile menu toggle
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
    }
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Scroll-triggered animations
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    
                    // Trigger skill bar animations
                    if (entry.target.classList.contains('skills-section')) {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            observer.observe(section);
        });
        
        // Observe cards and other elements
        const cards = document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card, .platform-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }
    
    // Setup various animations
    setupAnimations() {
        // Typing animation for section titles
        this.setupTypingAnimation();
        
        // Floating animations for profile images
        this.setupFloatingAnimations();
        
        // Button hover effects
        this.setupButtonEffects();
    }
    
    // Typing animation effect
    setupTypingAnimation() {
        const typingElements = document.querySelectorAll('.glitch');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            let index = 0;
            const typeWriter = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Start typing animation when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    // Floating animations for images
    setupFloatingAnimations() {
        const floatingElements = document.querySelectorAll('.profile-container, .about-profile-image, .freelance-avatar');
        
        floatingElements.forEach(element => {
            element.style.animation = 'float 6s ease-in-out infinite';
        });
        
        // Add floating animation keyframes
        if (!document.querySelector('#floating-styles')) {
            const style = document.createElement('style');
            style.id = 'floating-styles';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Button interaction effects
    setupButtonEffects() {
        const buttons = document.querySelectorAll('.service-btn, .action-btn, .show-more-btn, .platform-btn, .social-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
            
            button.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add ripple effect styles
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                }
                
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Skill bars animation
    setupSkillBars() {
        this.skillBarsAnimated = false;
    }
    
    animateSkillBars() {
        if (this.skillBarsAnimated) return;
        
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            if (progress) {
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 500);
            }
        });
        
        this.skillBarsAnimated = true;
    }
    
    // Contact form handling
    setupContactForm() {
        const form = document.getElementById('contact-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
            
            // Add input focus effects
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                });
            });
        }
    }
    
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner loading"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            this.showNotification('Message sent successfully! I will get back to you soon.', 'success');
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Add notification styles if not present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    z-index: 10000;
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(0, 255, 255, 0.3);
                    animation: slideInRight 0.3s ease;
                    max-width: 300px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                
                .notification-success {
                    border-color: rgba(50, 205, 50, 0.5);
                }
                
                .notification-success i {
                    color: #32CD32;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    margin-left: auto;
                    padding: 0;
                    font-size: 0.9rem;
                }
                
                .notification-close:hover {
                    color: white;
                }
                
                .notification.fade-out {
                    animation: slideOutRight 0.3s ease;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Utility methods
    debounce(func, wait) {
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
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Additional interactive features
class InteractiveFeatures {
    constructor() {
        this.setupCounterAnimations();
        this.setupVideoOverlays();
        this.setupServiceCardInteractions();
        this.setupSocialButtons();
    }
    
    // Animated counters for stats
    setupCounterAnimations() {
      const counters = document.querySelectorAll('.stat-number');

const animateCounter = (counter) => {
    // Correctly parse the initial number.
    const initialText = counter.textContent;
    const target = parseInt(initialText.replace(/[^0-9]/g, ''));
    
    // Set a default value in case parsing fails
    if (isNaN(target)) return;
    
    let current = 0;
    const duration = 1000; // Animation duration in milliseconds
    const increment = target / (duration / 20); // 20 is the interval time

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            clearInterval(timer);
            // Replace only the numbers with the final target value
            let finalValue = initialText.replace(/[0-9.]+/g, target.toString());
            // Restore any non-numeric characters
            finalValue = finalValue.replace('K', 'K+').replace('+', '+').replace('#', '#');
            counter.textContent = finalValue;
        } else {
            // Update the number during the animation
            counter.textContent = initialText.replace(/[0-9.]+/g, Math.floor(current));
        }
    }, 20);
};

// Start the animation for each counter
counters.forEach(animateCounter);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Video overlay interactions
    setupVideoOverlays() {
        const videoContainers = document.querySelectorAll('.portfolio-video, .testimonial-video');
        
        videoContainers.forEach(container => {
            const overlay = container.querySelector('.video-overlay');
            
            container.addEventListener('mouseenter', () => {
                if (overlay) {
                    overlay.style.opacity = '0.8';
                }
            });
            
            container.addEventListener('mouseleave', () => {
                if (overlay) {
                    overlay.style.opacity = '1';
                }
            });
        });
    }
    
    // Service card hover effects
    setupServiceCardInteractions() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    // Social media button interactions
    setupSocialButtons() {
        const socialBtns = document.querySelectorAll('.social-btn, .platform-btn-large');
        
        socialBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Add click animation
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
                
                // Show notification for demo purposes
                const platform = btn.textContent.trim();
                this.showToast(`Opening ${platform} profile...`);
            });
        });
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
        
        // Add toast styles if not present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateY(100px);
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 25px;
                    z-index: 10000;
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(0, 255, 255, 0.3);
                    transition: transform 0.3s ease;
                    font-size: 0.9rem;
                }
                
                .toast.show {
                    transform: translateX(-50%) translateY(0);
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main portfolio app
    const app = new PortfolioApp();
    
    // Initialize interactive features
    const features = new InteractiveFeatures();
    
    // Add loading animation to page
    document.body.classList.add('loaded');
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Portfolio loaded in ${Math.round(loadTime)}ms`);
        });
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, InteractiveFeatures };
}

// Expandable Portfolio and Testimonials functionality
document.addEventListener('DOMContentLoaded', () => {
    // Expandable Portfolio functionality
    const showMorePortfolioBtn = document.getElementById('show-more-portfolio');
    const portfolioGrid = document.getElementById('portfolio-grid');
    let portfolioExpanded = false;
    
    if (showMorePortfolioBtn) {
        showMorePortfolioBtn.addEventListener('click', function() {
            if (!portfolioExpanded) {
                // Generate additional portfolio items
                const additionalProjects = [
                    { video: "dQw4w9WgXcQ", tags: ["Real Estate", "CRM System", "Mobile App", "Analytics"] },
                    { video: "dQw4w9WgXcQ", tags: ["Corporate Video", "Drone Footage", "Color Grading", "Audio Mix"] },
                    { video: "dQw4w9WgXcQ", tags: ["Blockchain", "Smart Contracts", "DeFi Platform", "Security"] },
                    { video: "dQw4w9WgXcQ", tags: ["Social Media", "Influencer Tools", "API Integration", "Cloud Storage"] },
                    { video: "dQw4w9WgXcQ", tags: ["Educational Platform", "LMS System", "Interactive Content", "Progress Tracking"] },
                    { video: "dQw4w9WgXcQ", tags: ["Gaming Interface", "Unity Integration", "Multiplayer", "Real-time Chat"] },
                    { video: "dQw4w9WgXcQ", tags: ["Medical Software", "Patient Management", "HIPAA Compliance", "Data Security"] },
                    { video: "dQw4w9WgXcQ", tags: ["Fashion Brand", "Product Showcase", "AR Try-on", "E-commerce"] },
                    { video: "dQw4w9WgXcQ", tags: ["Food Delivery", "GPS Tracking", "Payment Gateway", "Order Management"] },
                    { video: "dQw4w9WgXcQ", tags: ["Music Production", "Audio Engineering", "Podcast Editing", "Sound Design"] },
                    { video: "dQw4w9WgXcQ", tags: ["Travel Agency", "Booking System", "Map Integration", "Review System"] },
                    { video: "dQw4w9WgXcQ", tags: ["Fitness App", "Workout Tracking", "Nutrition Plans", "Progress Analytics"] },
                    { video: "dQw4w9WgXcQ", tags: ["IoT Dashboard", "Sensor Data", "Real-time Monitoring", "Alerts System"] },
                    { video: "dQw4w9WgXcQ", tags: ["News Platform", "Content Management", "Editorial Tools", "SEO Optimization"] },
                    { video: "dQw4w9WgXcQ", tags: ["Event Management", "Ticket Sales", "Live Streaming", "Audience Analytics"] },
                    { video: "dQw4w9WgXcQ", tags: ["Cryptocurrency", "Trading Bot", "Market Analysis", "Risk Management"] },
                    { video: "dQw4w9WgXcQ", tags: ["Virtual Reality", "3D Environments", "Interactive Experience", "Motion Tracking"] }
                ];
                
                additionalProjects.forEach(project => {
                    const portfolioItem = document.createElement('div');
                    portfolioItem.className = 'portfolio-item';
                    portfolioItem.style.opacity = '0';
                    portfolioItem.style.transform = 'translateY(30px)';
                    
                    const tagElements = project.tags.map(tag => {
                        const colors = ['cyan', 'green', 'purple', 'yellow', 'orange'];
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        return `<span class="tag ${color}">${tag}</span>`;
                    }).join('');
                    
                    portfolioItem.innerHTML = `
                        <div class="portfolio-card">
                            <div class="portfolio-video">
                                <iframe src="https://www.youtube.com/embed/${project.video}" frameborder="0" allowfullscreen></iframe>
                                <div class="video-overlay">4K</div>
                            </div>
                            <div class="portfolio-tags">
                                ${tagElements}
                            </div>
                        </div>
                    `;
                    
                    portfolioGrid.appendChild(portfolioItem);
                    
                    // Animate in
                    setTimeout(() => {
                        portfolioItem.style.transition = 'all 0.5s ease';
                        portfolioItem.style.opacity = '1';
                        portfolioItem.style.transform = 'translateY(0)';
                    }, 50);
                });
                
                showMorePortfolioBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less Projects';
                portfolioExpanded = true;
            } else {
                // Remove additional items
                const items = portfolioGrid.querySelectorAll('.portfolio-item');
                for (let i = 3; i < items.length; i++) {
                    items[i].style.opacity = '0';
                    items[i].style.transform = 'translateY(-30px)';
                    setTimeout(() => {
                        if (items[i] && items[i].parentNode) {
                            items[i].remove();
                        }
                    }, 300);
                }
                
                showMorePortfolioBtn.innerHTML = '<i class="fas fa-cog"></i> Show All Projects (+17 more)';
                portfolioExpanded = false;
            }
        });
    }
    
    // Expandable Testimonials functionality
    const showMoreTestimonialsBtn = document.getElementById('show-more-testimonials');
    const testimonialsGrid = document.getElementById('testimonials-grid');
    let testimonialsExpanded = false;
    
    if (showMoreTestimonialsBtn) {
        showMoreTestimonialsBtn.addEventListener('click', function() {
            if (!testimonialsExpanded) {
                // Generate additional testimonial items
                const additionalTestimonials = [
                    { name: "David Wilson", company: "StartupHub", img: "photo-1507003211169-0a1dd7228f2d", tags: ["SaaS Platform", "User Analytics", "Growth Hacking"] },
                    { name: "Lisa Thompson", company: "Creative Studios", img: "photo-1494790108755-2616b612b1c7", tags: ["Brand Identity", "Marketing Videos", "Social Strategy"] },
                    { name: "Alex Rodriguez", company: "TechFlow", img: "photo-1472099645785-5658abf4ff4e", tags: ["API Development", "Database Optimization", "Cloud Migration"] },
                    { name: "Jennifer Kim", company: "InnovateCorp", img: "photo-1438761681033-6461ffad8d80", tags: ["Mobile App", "User Experience", "A/B Testing"] },
                    { name: "Robert Brown", company: "MediaWorks", img: "photo-1500648767791-00dcc994a43e", tags: ["Documentary", "Cinematography", "Post Production"] },
                    { name: "Amanda Foster", company: "DigitalEdge", img: "photo-1544725176-7c40e5a71c5e", tags: ["E-learning", "Interactive Content", "LMS Integration"] },
                    { name: "James Parker", company: "GrowthLab", img: "photo-1507003211169-0a1dd7228f2d", tags: ["Marketing Automation", "Lead Generation", "CRM Setup"] },
                    { name: "Maria Gonzalez", company: "CloudTech", img: "photo-1494790108755-2616b612b1c7", tags: ["Infrastructure", "DevOps", "Security Audit"] },
                    { name: "Thomas Lee", company: "FutureVision", img: "photo-1472099645785-5658abf4ff4e", tags: ["AR/VR Development", "3D Modeling", "Interactive Design"] },
                    { name: "Rachel White", company: "ContentCreators", img: "photo-1438761681033-6461ffad8d80", tags: ["YouTube Strategy", "Video SEO", "Thumbnail Design"] },
                    { name: "Kevin Davis", company: "RetailTech", img: "photo-1500648767791-00dcc994a43e", tags: ["POS System", "Inventory Management", "Customer Analytics"] },
                    { name: "Sophie Miller", company: "HealthTech", img: "photo-1544725176-7c40e5a71c5e", tags: ["Medical App", "HIPAA Compliance", "Patient Portal"] },
                    { name: "Daniel Johnson", company: "FinanceFlow", img: "photo-1507003211169-0a1dd7228f2d", tags: ["Trading Platform", "Risk Analysis", "Compliance"] },
                    { name: "Isabella Garcia", company: "EduTech", img: "photo-1494790108755-2616b612b1c7", tags: ["Learning Analytics", "Student Engagement", "Mobile Learning"] },
                    { name: "Christopher Moore", company: "SportsTech", img: "photo-1472099645785-5658abf4ff4e", tags: ["Performance Tracking", "Video Analysis", "Team Management"] }
                ];
                
                additionalTestimonials.forEach(testimonial => {
                    const testimonialItem = document.createElement('div');
                    testimonialItem.className = 'testimonial-card';
                    testimonialItem.style.opacity = '0';
                    testimonialItem.style.transform = 'translateY(30px)';
                    
                    const tagElements = testimonial.tags.map(tag => {
                        const colors = ['cyan', 'green', 'purple', 'yellow', 'orange'];
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        return `<span class="tag ${color}">${tag}</span>`;
                    }).join('');
                    
                    testimonialItem.innerHTML = `
                        <div class="testimonial-video">
                            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
                            <div class="video-overlay">4K</div>
                        </div>
                        <div class="testimonial-author">
                            <img src="https://images.unsplash.com/${testimonial.img}?w=100&h=100&fit=crop&crop=face" alt="${testimonial.name}" class="author-avatar">
                            <div class="author-info">
                                <h4>${testimonial.name}</h4>
                                <p>${testimonial.company}</p>
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </div>
                            </div>
                        </div>
                        <div class="testimonial-tags">
                            ${tagElements}
                        </div>
                    `;
                    
                    testimonialsGrid.appendChild(testimonialItem);
                    
                    // Animate in
                    setTimeout(() => {
                        testimonialItem.style.transition = 'all 0.5s ease';
                        testimonialItem.style.opacity = '1';
                        testimonialItem.style.transform = 'translateY(0)';
                    }, 50);
                });
                
                showMoreTestimonialsBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less Testimonials';
                testimonialsExpanded = true;
            } else {
                // Remove additional items
                const items = testimonialsGrid.querySelectorAll('.testimonial-card');
                for (let i = 3; i < items.length; i++) {
                    items[i].style.opacity = '0';
                    items[i].style.transform = 'translateY(-30px)';
                    setTimeout(() => {
                        if (items[i] && items[i].parentNode) {
                            items[i].remove();
                        }
                    }, 300);
                }
                
                showMoreTestimonialsBtn.innerHTML = '<i class="fas fa-heart"></i> Show All Testimonials (+17 more)';
                testimonialsExpanded = false;
            }
        });
    }
});
