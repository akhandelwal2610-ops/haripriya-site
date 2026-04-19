(function () {
  'use strict';

  /* ============================================================
     HARIPRIYA — main.js
     Nav · Language · Tabs · Scroll Reveal · Counters · WA Form
     ============================================================ */

  /* ---- NAV: scroll shadow ---- */
  var nav = document.getElementById('siteNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---- NAV: mobile hamburger ---- */
  var burger   = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    // close on link click
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- LANGUAGE TOGGLE ---- */
  window.setLang = function (lang, btn) {
    document.querySelectorAll('.lb').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    if (lang === 'hi') {
      document.body.classList.add('hindi');
      document.documentElement.lang = 'hi';
    } else {
      document.body.classList.remove('hindi');
      document.documentElement.lang = 'en';
    }
  };

  /* ---- PROCEDURE TABS ---- */
  document.querySelectorAll('.proc-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var procId = this.dataset.proc;
      // deactivate all tabs
      document.querySelectorAll('.proc-tab').forEach(function (t) { t.classList.remove('active'); });
      // deactivate all panels
      document.querySelectorAll('.proc-panel').forEach(function (p) { p.classList.remove('active'); });
      // activate clicked tab and its panel
      this.classList.add('active');
      var panel = document.getElementById('proc-' + procId);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---- SERVICE TABS ---- */
  document.querySelectorAll('.srv-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var srvId = this.dataset.srv;
      document.querySelectorAll('.srv-tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.srv-panel').forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      var panel = document.getElementById('srv-' + srvId);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---- BLOG FILTER TABS (blog page) ---- */
  document.querySelectorAll('.blog-filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.blog-filter').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      var cat = this.dataset.cat;
      document.querySelectorAll('.blog-card').forEach(function (card) {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---- SCROLL REVEAL ---- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-s');
  if ('IntersectionObserver' in window && revealEls.length) {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) {
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            revObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      revealEls.forEach(function (el) { revObs.observe(el); });
      // failsafe: show all after 2.5s
      setTimeout(function () {
        revealEls.forEach(function (el) { el.classList.add('vis'); });
      }, 2500);
    } else {
      // reduced motion — show everything immediately
      revealEls.forEach(function (el) { el.classList.add('vis'); });
    }
  } else {
    revealEls.forEach(function (el) { el.classList.add('vis'); });
  }

  /* ---- ANIMATED COUNTERS ---- */
  function animateCounter(el) {
    var target   = parseInt(el.dataset.count, 10);
    var suffix   = el.dataset.suffix || '';
    var duration = 1800;
    var start    = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counterEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counterEls.length) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(function (el) { counterObs.observe(el); });
  }

  /* ---- WHATSAPP FORM ---- */
  window.submitViaWhatsApp = function () {
    var name  = (document.getElementById('cf-name')  || {}).value || '';
    var phone = (document.getElementById('cf-phone') || {}).value || '';
    var dept  = (document.getElementById('cf-dept')  || {}).value || '';
    var msg   = (document.getElementById('cf-msg')   || {}).value || '';
    name  = name.trim();
    phone = phone.trim();
    if (!name)  { alert('Please enter your name.'); return; }
    if (!phone) { alert('Please enter your phone number.'); return; }
    var text = [
      'New Appointment Request — Haripriya Centre',
      '',
      'Name: '       + name,
      'Phone: '      + phone,
      'Department: ' + dept,
      msg ? 'Concern: ' + msg : '',
      '',
      'Sent via haripriyacare.in'
    ].filter(Boolean).join('\n');
    window.open('https://wa.me/917217327979?text=' + encodeURIComponent(text), '_blank');
  };

  /* ---- SMART WHATSAPP FLOAT: changes message by section ---- */
  var waFloat = document.getElementById('waFloat');
  if (waFloat) {
    var defaultMsg = 'Hi, I found Haripriya Heart & Eye Care Centre and would like to book an appointment.';
    var sectionMsgs = {
      'doctors':    'Hi, I would like to know about the doctors at Haripriya Centre, Meerut.',
      'procedures': 'Hi, I have a query about a medical procedure at Haripriya Centre.',
      'services':   'Hi, I would like to enquire about a service at Haripriya Centre.',
      'blog':       'Hi, I read your health article and would like to consult a doctor at Haripriya Centre.',
      'contact':    'Hi, I would like to book an appointment at Haripriya Centre, Meerut.'
    };
    function setWaMsg(msg) {
      waFloat.href = 'https://wa.me/917217327979?text=' + encodeURIComponent(msg);
    }
    setWaMsg(defaultMsg);
    if ('IntersectionObserver' in window) {
      var waObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && sectionMsgs[entry.target.id]) {
            setWaMsg(sectionMsgs[entry.target.id]);
          }
        });
      }, { threshold: 0.3 });
      Object.keys(sectionMsgs).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) waObs.observe(el);
      });
    }
  }

  /* ---- ACTIVE NAV LINK highlighting on scroll ---- */
  var sections = document.querySelectorAll('section[id], div[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');
  if ('IntersectionObserver' in window && navAnchors.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.style.color = '';
            if (a.getAttribute('href') === '#' + entry.target.id) {
              a.style.color = 'var(--ink)';
            }
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(function (sec) { navObs.observe(sec); });
  }

})();
