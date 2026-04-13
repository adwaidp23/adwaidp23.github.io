document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const currentYearFullSpan = document.getElementById('current-year-full');
    if (currentYearFullSpan) {
        currentYearFullSpan.textContent = new Date().getFullYear();
    }

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observerInstance.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    document.querySelectorAll('.fade-in, .slide-in').forEach((el) => observer.observe(el));

    if (window.matchMedia('(min-width: 981px)').matches) {
        document.querySelectorAll('.loop-track').forEach((track) => {
            const clone = track.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('a, button, input, textarea, select').forEach((el) => {
                el.setAttribute('tabindex', '-1');
            });
            while (clone.firstElementChild) {
                track.appendChild(clone.firstElementChild);
            }
        });
    }

    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));

    const updateActiveNavLink = () => {
        let currentSectionId = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const triggerTop = window.pageYOffset + window.innerHeight * 0.35;

            if (triggerTop >= sectionTop && triggerTop < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            const isOnProjectsPage = window.location.pathname.includes('projects/');
            const shouldActivateProject = isOnProjectsPage && href.includes('#projects');
            const shouldActivateSection = currentSectionId && href.endsWith(`#${currentSectionId}`);

            link.classList.toggle('active', Boolean(shouldActivateProject || shouldActivateSection));
        });
    };

    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    window.addEventListener('resize', updateActiveNavLink);

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(navToggle.classList.contains('active')));
        });

        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('is-open')) {
                    navMenu.classList.remove('is-open');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (form && formStatus && window.emailjs) {
        const serviceID = 'service_cqrk12s';
        const templateID = 'template_4t4b9uv';
        const publicKey = 'YjgP4YPNEQC9RyhtZ';

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            formStatus.textContent = 'Sending...';
            formStatus.classList.remove('form-status-success', 'form-status-error');

            try {
                const response = await emailjs.sendForm(serviceID, templateID, form, publicKey);

                if (response.status === 200) {
                    formStatus.textContent = 'Message sent successfully.';
                    formStatus.classList.add('form-status-success');
                    form.reset();
                } else {
                    formStatus.textContent = 'Unable to send the message right now.';
                    formStatus.classList.add('form-status-error');
                }
            } catch (error) {
                formStatus.textContent = `Error: ${error?.text || 'Network issue or EmailJS configuration problem.'}`;
                formStatus.classList.add('form-status-error');
                console.error('EmailJS Submission Error:', error);
            }

            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.classList.remove('form-status-success', 'form-status-error');
            }, 6000);
        });
    }
});
