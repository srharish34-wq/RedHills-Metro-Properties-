/* =========================================================
   ENQUIRY PAGE — form validation + submit handling
   ========================================================= */
(function () {
  var form = document.getElementById('enquiryForm');
  if (!form) return;

  var submitBtn = document.getElementById('enquirySubmitBtn');
  var statusEl = document.getElementById('enquiryStatus');

  var fields = {
    fullName: { el: form.fullName, validate: function (v) { return v.trim().length >= 2; }, message: 'Please enter your full name.' },
    phone: { el: form.phone, validate: function (v) { return /^[6-9]\d{9}$/.test(v.trim()); }, message: 'Enter a valid 10-digit mobile number.' },
    email: { el: form.email, validate: function (v) { return v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, message: 'Enter a valid email address.' },
    interest: { el: form.interest, validate: function (v) { return v !== ''; }, message: 'Please select what you\'re interested in.' }
  };

  function showError(name, message) {
    var errorEl = form.querySelector('[data-error-for="' + name + '"]');
    if (errorEl) errorEl.textContent = message || '';
    if (fields[name] && fields[name].el) {
      fields[name].el.classList.toggle('is-invalid', !!message);
    }
  }

  function validateField(name) {
    var field = fields[name];
    if (!field) return true;
    var value = field.el.value || '';
    var valid = field.validate(value);
    showError(name, valid ? '' : field.message);
    return valid;
  }

  // Validate on blur for immediate feedback
  Object.keys(fields).forEach(function (name) {
    if (fields[name].el) {
      fields[name].el.addEventListener('blur', function () { validateField(name); });
    }
  });

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'form__status' + (type ? ' form__status--' + type : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = true;
    Object.keys(fields).forEach(function (name) {
      if (!validateField(name)) isValid = false;
    });

    if (!isValid) {
      setStatus('Please fix the highlighted fields above.', 'error');
      return;
    }

    var payload = {
      fullName: form.fullName.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      interest: form.interest.value,
      budget: form.budget.value,
      location: form.location.value.trim(),
      visitDate: form.visitDate.value,
      message: form.message.value.trim(),
      whatsappConsent: form.whatsappConsent.checked
    };

    submitBtn.classList.add('is-loading');
    submitBtn.querySelector('.btn__label').textContent = 'Submitting...';
    setStatus('', '');

    // TODO: replace this block with a real request to your backend / form service,
    // e.g. Formspree, EmailJS, Google Sheets webhook, or your own API endpoint.
    //
    // fetch('https://your-backend.example.com/api/enquiry', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // })
    //   .then(function (res) { if (!res.ok) throw new Error('Request failed'); return res.json(); })
    //   .then(onSuccess)
    //   .catch(onError);

    setTimeout(function () { onSuccess(payload); }, 900); // simulated delay — remove once wired to a real backend
  });

  function onSuccess(payload) {
    submitBtn.classList.remove('is-loading');
    submitBtn.querySelector('.btn__label').textContent = 'Submit Enquiry';
    setStatus('Thank you, ' + payload.fullName.split(' ')[0] + '! Our team will call you back shortly.', 'success');
    form.reset();
    form.whatsappConsent.checked = true;

    // Optional: also open WhatsApp pre-filled with the enquiry, if the user opted in
    if (payload.whatsappConsent) {
      var text = 'Hi, I just submitted an enquiry on your site.%0A' +
        'Name: ' + encodeURIComponent(payload.fullName) + '%0A' +
        'Interested in: ' + encodeURIComponent(payload.interest);
      // Uncomment to auto-open WhatsApp after submit:
      // window.open('https://wa.me/918610758861?text=' + text, '_blank');
    }
  }

  function onError() {
    submitBtn.classList.remove('is-loading');
    submitBtn.querySelector('.btn__label').textContent = 'Submit Enquiry';
    setStatus('Something went wrong. Please call us directly at +91 86107 58861.', 'error');
  }
})();