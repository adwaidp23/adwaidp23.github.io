// Contact form submission (demo only)
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Thank you for your message!');
  contactForm.reset();
});
