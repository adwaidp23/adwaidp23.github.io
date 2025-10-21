document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('contactSubmit');

  form.addEventListener('submit', async (e) => {
    // Let browser perform built‑in validation first
    if (!form.checkValidity()) return;

    e.preventDefault();
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    statusEl.textContent = '';

    const action = form.getAttribute('action') || '';
    const formData = new FormData(form);

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        statusEl.style.color = 'green';
        statusEl.textContent = 'Message sent — thank you!';
        form.reset();

        const next = form.querySelector('input[name="_next"]')?.value;
        if (next) setTimeout(() => { window.location.href = next; }, 900);
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error || 'Unable to send message. Try again later.';
        statusEl.style.color = 'crimson';
        statusEl.textContent = msg;
      }
    } catch (err) {
      statusEl.style.color = 'crimson';
      statusEl.textContent = 'Network error. Check your connection.';
      console.error('Contact form error:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
