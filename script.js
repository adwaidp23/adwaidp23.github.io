document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // IntersectionObserver for animations
  const observerOptions = {
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // Contact form handling — show a popup (toast) instead of redirecting
  const form = document.getElementById('contactForm');
  if (form) {
    const submitBtn = document.getElementById('contactSubmit');

    function showToast(message, success = true) {
      const toast = document.createElement('div');
      toast.setAttribute('role', 'status');
      toast.style.position = 'fixed';
      toast.style.left = '50%';
      toast.style.bottom = '24px';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = success ? 'linear-gradient(90deg,#2ecc71,#27ae60)' : 'linear-gradient(90deg,#ff6b6b,#e74c3c)';
      toast.style.color = '#fff';
      toast.style.padding = '12px 18px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
      toast.style.fontWeight = '600';
      toast.style.zIndex = '2000';
      toast.style.maxWidth = '90%';
      toast.style.textAlign = 'center';
      toast.textContent = message;

      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transition = 'opacity 250ms ease, transform 250ms ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(8px)';
      }, 2200);
      setTimeout(() => toast.remove(), 2500);
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!form.checkValidity()) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        var originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
      }

      const formData = new FormData(form);

      try {
        const response = await emailjs.sendForm('service_cqrk12s', 'template_j8j4ezj', form, 'YjgP4YPNEQC9RyhtZ');
        if (response.status === 200) {
          showToast('Message sent — thank you!', true);
          form.reset();
        } else {
          showToast('Failed to send message. Please try again.', false);
        }
      } catch (err) {
        console.error('Contact form error:', err);
        showToast('Network error. Check your connection.', false);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
});
