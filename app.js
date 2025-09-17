// Global variables
let isTypingComplete = false;

// DOM elements
const typingText = document.getElementById('typingText');
const scrollProgress = document.getElementById('scrollProgress');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Typing animation texts
const typingTexts = [
    'Estudante de Ciência da Computação',
    'Futuro DevOps Engineer',
    'Especialista em SRE'
];

let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTypingAnimation();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScrolling();
    initScrollProgress();
    initSkillBars();
    initContactForm();
    
    // Trigger initial animations
    setTimeout(() => {
        animateHeroElements();
    }, 1000);
});

// Typing animation
function initTypingAnimation() {
    if (!typingText) return;
    
    typeText();
}

function typeText() {
    const currentText = typingTexts[currentTextIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        typingText.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && currentCharIndex === currentText.length) {
        typeSpeed = 2000; // Pause before deleting
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
        typeSpeed = 500; // Pause before typing next text
    }
    
    setTimeout(typeText, typeSpeed);
}

// Animate hero elements after typing starts
function animateHeroElements() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.transform = 'translateY(0)';
    }
    
    if (heroCta) {
        setTimeout(() => {
            heroCta.style.opacity = '1';
            heroCta.style.transform = 'translateY(0)';
        }, 300);
    }
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for skill bars
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-up, .section-title, .skill-category');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Scroll to section function
function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Scroll progress bar
function initScrollProgress() {
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', updateScrollProgress);
}

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;
}

// Skill bars animation
function initSkillBars() {
    // This will be triggered by the intersection observer
}

function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) {
            setTimeout(() => {
                bar.style.width = width + '%';
            }, Math.random() * 500); // Stagger animations
        }
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formFields = e.target.querySelectorAll('.form-control');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Simple form validation
    let isValid = true;
    formFields.forEach(field => {
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ff4444';
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Simulate form submission
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    setTimeout(() => {
        showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
        e.target.reset();
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensagem';
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#006C7A';
            break;
        case 'error':
            notification.style.backgroundColor = '#ff4444';
            break;
        default:
            notification.style.backgroundColor = '#666666';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Header background on scroll
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Parallax effect for hero background
function initParallax() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        heroBackground.style.transform = `translateY(${parallax}px)`;
    });
}

// Initialize additional effects
window.addEventListener('load', () => {
    initHeaderScroll();
    initParallax();
});

// Utility functions
function throttle(func, wait) {
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

// Add throttled scroll listener for performance
window.addEventListener('scroll', throttle(() => {
    updateScrollProgress();
}, 10));

// Add hover effects for project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card, .course-card, .education-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Add scroll listener for active nav link
window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--color-primary);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--color-background);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: 'Carregando...';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        color: var(--color-primary);
        font-weight: 600;
        font-size: 18px;
    }
    
    body.loaded::before,
    body.loaded::after {
        opacity: 0;
        visibility: hidden;
        transition: all 0.5s ease;
    }
`;
document.head.appendChild(loadingStyle);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        showNotification('🎉 Easter egg encontrado! Você é um verdadeiro desenvolvedor!', 'success');
        konamiCode = [];
        
        // Add some fun animation
        document.body.style.animation = 'rainbow 2s linear';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Add rainbow animation CSS
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);