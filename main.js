function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

function switchTab(tab, btn) {
  document.querySelectorAll('.service-panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  var panel = document.getElementById('panel-' + tab);
  if (panel) panel.classList.add('active');
  btn.classList.add('active');
}

// Step 1: pick category (Roofing / Siding / Both)
function pickCategory(btn, formId) {
  var form = document.getElementById(formId);
  form.querySelectorAll('.cat-opt').forEach(function(b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
  form.dataset.cat = btn.dataset.cat;
  var next = form.querySelector('.cat-next-btn');
  if (next) next.disabled = false;
}

// Step 1 → Step 2: route to correct service page
function goToServices(formId, dotPrefix) {
  var form = document.getElementById(formId);
  var cat = form.dataset.cat || 'roofing';
  var prefix = (dotPrefix || 's-dot-').replace('dot-', 'p');
  form.querySelectorAll('.form-page').forEach(function(p) { p.classList.remove('active'); });
  var suffix = cat === 'roofing' ? '2r' : cat === 'siding' ? '2s' : '2b';
  var page = document.getElementById(prefix + suffix);
  if (page) page.classList.add('active');
}

// Step 2: pick a service tile — exclusive selection within active page
function pickSvc(btn, formId) {
  var form = document.getElementById(formId);
  var activePage = form.querySelector('.form-page.active');
  activePage.querySelectorAll('.svc-opt').forEach(function(b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
  var next = activePage.querySelector('.svc-next-btn');
  if (next) next.disabled = false;
}

// Step 2B: toggle service tile — multi-select for "both" page
function toggleSvc(btn, formId) {
  btn.classList.toggle('selected');
  var form = document.getElementById(formId);
  var activePage = form.querySelector('.form-page.active');
  var hasSelection = activePage.querySelectorAll('.svc-opt.selected').length > 0;
  var next = activePage.querySelector('.svc-next-btn');
  if (next) next.disabled = !hasSelection;
}

// Step 2 → Step 1: back to category
function goToCategory(formId, dotPrefix) {
  var form = document.getElementById(formId);
  var prefix = (dotPrefix || 's-dot-').replace('dot-', 'p');
  form.querySelectorAll('.form-page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById(prefix + '1').classList.add('active');
}

// Step 2 → Step 3: go to contact info
function goToContact(formId, dotPrefix) {
  var form = document.getElementById(formId);
  var prefix = (dotPrefix || 's-dot-').replace('dot-', 'p');
  form.querySelectorAll('.form-page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById(prefix + '3').classList.add('active');
}

// Step 3 → Step 2: back to correct service page
function goToServicesBack(formId, dotPrefix) {
  var form = document.getElementById(formId);
  var cat = form.dataset.cat || 'roofing';
  var prefix = (dotPrefix || 's-dot-').replace('dot-', 'p');
  form.querySelectorAll('.form-page').forEach(function(p) { p.classList.remove('active'); });
  var suffix = cat === 'roofing' ? '2r' : cat === 'siding' ? '2s' : '2b';
  document.getElementById(prefix + suffix).classList.add('active');
}

// Step 3 → Step 4: go to project details
function goToDetails(formId, dotPrefix) {
  var form = document.getElementById(formId);
  var prefix = (dotPrefix || 's-dot-').replace('dot-', 'p');
  form.querySelectorAll('.form-page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById(prefix + '4').classList.add('active');
}

function handleSubmit(e) {
  e.preventDefault();
  var form = e.target;
  var btn = form.querySelector('button[type=submit]');

  var firstName = (form.querySelector('[name=first_name]') || {value:''}).value.trim();
  var lastName  = (form.querySelector('[name=last_name]')  || {value:''}).value.trim();
  var name      = [firstName, lastName].filter(Boolean).join(' ');
  var phone     = (form.querySelector('[name=phone]')      || {value:''}).value.trim();
  var email     = (form.querySelector('[name=email]')      || {value:''}).value.trim();
  var postalZip = (form.querySelector('[name=postal_zip]') || {value:''}).value.trim();
  var notesVal  = (form.querySelector('[name=notes]')      || {value:''}).value.trim();
  var timeline  = (form.querySelector('[name=timeline]')   || {value:''}).value.trim();
  var notes     = [notesVal, timeline ? 'Timeline: ' + timeline : ''].filter(Boolean).join('\n');

  var products    = form.dataset.cat || '';
  var subProduct  = Array.from(form.querySelectorAll('.svc-opt.selected'))
                      .map(function(b) { return b.textContent.trim(); }).join(', ');

  var payload = {
    client_id:      '3f4633bb-5f51-4f31-bb81-4f97bd3899db',
    name:           name,
    phone:          phone,
    email:          email,
    postal_zip:     postalZip,
    products:       products,
    sub_product:    subProduct,
    notes:          notes,
    source:         document.title,
    conversion_url: window.location.href
  };

  btn.textContent = 'Sending…';
  btn.disabled = true;

  fetch('https://usxheeuynoyifyczejfy.supabase.co/functions/v1/zapier-lead-webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function() {
    btn.textContent = "Sent! We'll be in touch soon.";
    btn.style.background = '#3a6b1a';
  }).catch(function() {
    btn.textContent = 'Submit Request →';
    btn.disabled = false;
  });
}

function carouselPrev(trackId, dotsId) {
  var track = document.getElementById(trackId);
  if (!track) return;
  track.scrollBy({ left: -track.firstElementChild.offsetWidth, behavior: 'smooth' });
  setTimeout(function() { updateCarouselDots(trackId, dotsId); }, 350);
}

function carouselNext(trackId, dotsId) {
  var track = document.getElementById(trackId);
  if (!track) return;
  track.scrollBy({ left: track.firstElementChild.offsetWidth, behavior: 'smooth' });
  setTimeout(function() { updateCarouselDots(trackId, dotsId); }, 350);
}

function updateCarouselDots(trackId, dotsId) {
  var track = document.getElementById(trackId);
  var dotsEl = document.getElementById(dotsId);
  if (!track || !dotsEl) return;
  var itemWidth = track.firstElementChild.offsetWidth;
  if (!itemWidth) return;
  var index = Math.round(track.scrollLeft / itemWidth);
  dotsEl.querySelectorAll('.dot').forEach(function(d, i) {
    d.classList.toggle('active', i === index);
  });
}

function faqToggle(el) {
  var item = el.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i) { i.classList.remove('open'); });
  if (!wasOpen) item.classList.add('open');
}

document.addEventListener('DOMContentLoaded', function() {
  ['gallery-track', 'testimonials-track'].forEach(function(trackId) {
    var track = document.getElementById(trackId);
    if (!track) return;
    var dotsId = trackId.replace('-track', '-dots');
    track.addEventListener('scroll', function() {
      updateCarouselDots(trackId, dotsId);
    }, { passive: true });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.remove('open');
      }
    });
  });
});
