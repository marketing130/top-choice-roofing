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
  var prefix = dotPrefix.replace('dot-', 'p');
  form.querySelectorAll('.form-page').forEach(function(p) { p.classList.remove('active'); });
  var suffix = cat === 'roofing' ? '2r' : cat === 'siding' ? '2s' : '2b';
  var page = document.getElementById(prefix + suffix);
  if (page) page.classList.add('active');
  setFormDots(dotPrefix, 2);
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
  var prefix = dotPrefix.replace('dot-', 'p');
  form.querySelectorAll('.form-page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById(prefix + '1').classList.add('active');
  setFormDots(dotPrefix, 1);
}

// Step 2 → Step 3: go to contact info
function goToContact(formId, dotPrefix) {
  var form = document.getElementById(formId);
  var prefix = dotPrefix.replace('dot-', 'p');
  form.querySelectorAll('.form-page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById(prefix + '3').classList.add('active');
  setFormDots(dotPrefix, 3);
}

// Step 3 → Step 2: back to correct service page
function goToServicesBack(formId, dotPrefix) {
  var form = document.getElementById(formId);
  var cat = form.dataset.cat || 'roofing';
  var prefix = dotPrefix.replace('dot-', 'p');
  form.querySelectorAll('.form-page').forEach(function(p) { p.classList.remove('active'); });
  var suffix = cat === 'roofing' ? '2r' : cat === 'siding' ? '2s' : '2b';
  document.getElementById(prefix + suffix).classList.add('active');
  setFormDots(dotPrefix, 2);
}

// Step 3 → Step 4: go to project details
function goToDetails(formId, dotPrefix) {
  var form = document.getElementById(formId);
  var prefix = dotPrefix.replace('dot-', 'p');
  form.querySelectorAll('.form-page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById(prefix + '4').classList.add('active');
  setFormDots(dotPrefix, 4);
}

// Update progress dots (4-step)
function setFormDots(dotPrefix, step) {
  for (var i = 1; i <= 4; i++) {
    var dot = document.getElementById(dotPrefix + i);
    if (!dot) continue;
    dot.classList.remove('active', 'done');
    if (i < step) dot.classList.add('done');
    else if (i === step) dot.classList.add('active');
  }
}

function handleSubmit(e, dotPrefix) {
  e.preventDefault();
  var btn = e.target.querySelector('button[type=submit]');
  btn.textContent = "Sent! We'll be in touch soon.";
  btn.style.background = '#3a6b1a';
  btn.disabled = true;
  if (dotPrefix) {
    for (var i = 1; i <= 4; i++) {
      var dot = document.getElementById(dotPrefix + i);
      if (dot) dot.classList.add('done');
    }
  }
}

function faqToggle(el) {
  var item = el.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i) { i.classList.remove('open'); });
  if (!wasOpen) item.classList.add('open');
}

document.addEventListener('DOMContentLoaded', function() {
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
