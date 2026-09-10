  /* ---------- Theme toggle (session only — no localStorage in artifacts) ---------- */
  var themeToggle = document.getElementById('themeToggle');
  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    window.__ikennaTheme = t;
    themeToggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  themeToggle.addEventListener('click', function(){
    var current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Sticky nav background ---------- */
  var nav = document.getElementById('siteNav');
  window.addEventListener('scroll', function(){
    nav.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  var menuOpen = document.getElementById('menuOpen');
  var mobileMenu = document.getElementById('mobileMenu');
  function closeMenu(){
    mobileMenu.classList.remove('open');
    menuOpen.setAttribute('aria-expanded', 'false');
  }
  menuOpen.addEventListener('click', function(){
    var isOpen = mobileMenu.classList.toggle('open');
    menuOpen.setAttribute('aria-expanded', String(isOpen));
  });
  mobileMenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeMenu();
  });

  /* ---------- Scroll reveal (single subtle pass) ---------- */
  var revealTargets = document.querySelectorAll('section > .wrap');
  revealTargets.forEach(function(el){ el.classList.add('fade-in'); });
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function(el){ io.observe(el); });
  } else {
    revealTargets.forEach(function(el){ el.classList.add('visible'); });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contactForm');
var status = document.getElementById('formStatus');
var submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var message = document.getElementById('message');

    var nameError = document.getElementById('nameError');
    var emailError = document.getElementById('emailError');
    var messageError = document.getElementById('messageError');

    // Clear previous errors and status
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    status.textContent = '';

    var valid = true;

    // Validate name
    if (!name.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        valid = false;
    }

    // Validate email
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        !email.value.trim() ||
        !emailPattern.test(email.value.trim())
    ) {
        emailError.textContent = 'Please enter a valid email address.';
        valid = false;
    }

    // Validate message
    if (!message.value.trim()) {
        messageError.textContent = 'Please add a short message.';
        valid = false;
    }

    // Stop submission if validation fails
    if (!valid) {
        return;
    }

    // Create form data
    var formData = new FormData(form);

    // Web3Forms access key
    formData.append(
        'access_key',
        '87e1a818-d031-4bd8-8908-922abb28e491'
    );

    var originalText = submitBtn.textContent;

    // Change button while sending
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {

        var response = await fetch(
            'https://api.web3forms.com/submit',
            {
                method: 'POST',
                body: formData
            }
        );

        var data = await response.json();

        if (response.ok) {

            status.textContent =
                'Thanks — your message has been sent successfully.';

            form.reset();

        } else {

            status.textContent =
                'Error: ' + data.message;

        }

    } catch (error) {

        status.textContent =
            'Something went wrong. Please try again.';

    } finally {

        // Restore button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    }
});