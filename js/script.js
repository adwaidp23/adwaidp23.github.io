document.addEventListener('DOMContentLoaded', () => {
    // 0. EmailJS Initialization (if not done in HTML)
    // If you haven't initialized EmailJS in your HTML script tag, you can do it here:
    // emailjs.init('YjgP4YPNEQC9RyhtZ'); // Your EmailJS Public Key

    // 1. Dynamic Copyright Year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const currentYearFullSpan = document.getElementById('current-year-full');
    if (currentYearFullSpan) {
        currentYearFullSpan.textContent = new Date().getFullYear();
    }

    // 2. Scroll Animation Logic (IntersectionObserver)
    const observerOptions = {
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
        observer.observe(el);
    });

    // 3. Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Function to update active link
    const updateActiveNavLink = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            // Calculate a more robust trigger point (e.g., 20% from top of viewport)
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Check if scroll position is within the section, slightly adjusted
            if (window.pageYOffset >= sectionTop - window.innerHeight * 0.3 && 
                window.pageYOffset < sectionTop + sectionHeight - window.innerHeight * 0.3) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            // Ensure href exists and check for both #id and index.html#id patterns
            const href = a.getAttribute('href');
            if (href && (href === `#${currentSectionId}` || href.endsWith(`#${currentSectionId}`))) {
                a.classList.add('active');
            } else if (window.location.pathname.includes('projects-full.html') && href && href.includes('#projects')) {
                // Special handling for the Projects link on the full projects page
                a.classList.add('active');
            }
        });
    };

    // Initial check and on scroll
    updateActiveNavLink(); // Call once on load
    window.addEventListener('scroll', updateActiveNavLink);
    window.addEventListener('resize', updateActiveNavLink); // Also update on resize if layout shifts


    // 4. Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
            navToggle.classList.toggle('active'); // For burger icon animation
            const expanded = navToggle.classList.contains('active');
            navToggle.setAttribute('aria-expanded', expanded);
        });

        // Close nav menu when a link is clicked (for single-page navigation)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('is-open')) {
                    navMenu.classList.remove('is-open');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // 5. Contact Form Submission (Using EmailJS)
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        const serviceID = 'service_cqrk12s';    // Your EmailJS Service ID
        const templateID = 'template_4t4b9uv';  // Your EmailJS Template ID
        const publicKey = 'YjgP4YPNEQC9RyhtZ'; // Your EmailJS Public Key (redundant if initialized, but safe)

        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            formStatus.textContent = 'Sending...';
            formStatus.classList.remove('form-status-success', 'form-status-error'); // Clear previous status styles
            
            try {
                const response = await emailjs.sendForm(serviceID, templateID, form, publicKey);

                if (response.status === 200) { 
                    formStatus.textContent = 'Message Sent Successfully! ✅';
                    formStatus.classList.add('form-status-success');
                    form.reset();
                } else {
                    formStatus.textContent = 'Oops! There was an issue sending the email. ❌';
                    formStatus.classList.add('form-status-error');
                }

            } catch (error) {
                formStatus.textContent = `Error: ${error.text || 'Network problem or configuration issue.'} 🌐`;
                formStatus.classList.add('form-status-error');
                console.error('EmailJS Submission Error:', error);
            }

            // Clear status after a few seconds
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.classList.remove('form-status-success', 'form-status-error');
            }, 7000); // Increased timeout for better readability
        });
    }
});
