/* =============================================
   MBBS Education Orbit Fly — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // AOS — Animate On Scroll
  // =========================================
  AOS.init({
    duration: 680,
    easing: 'ease-out-cubic',
    once: true,
    offset: 55,
  });


  // =========================================
  // TOAST NOTIFICATION (injected globally)
  // =========================================
  const toastEl = document.createElement('div');
  toastEl.id = 'wa-toast';
  toastEl.style.cssText = 'position:fixed;top:1.5rem;right:1.5rem;z-index:9999;display:flex;align-items:center;gap:.75rem;background:#22c55e;color:#fff;padding:.875rem 1.25rem;border-radius:.875rem;box-shadow:0 8px 30px rgba(0,0,0,.18);font-size:.875rem;font-weight:600;transform:translateX(calc(100% + 2rem));transition:transform .4s cubic-bezier(.34,1.56,.64,1);pointer-events:none;';
  toastEl.innerHTML = '<i class="fa-solid fa-circle-check" style="font-size:1.1rem"></i><span>Opening WhatsApp…</span>';
  document.body.appendChild(toastEl);

  window.showToast = (msg = 'Opening WhatsApp…') => {
    toastEl.querySelector('span').textContent = msg;
    toastEl.style.transform = 'translateX(0)';
    setTimeout(() => { toastEl.style.transform = 'translateX(calc(100% + 2rem))'; }, 3800);
  };


  // =========================================
  // WHATSAPP REDIRECT
  // =========================================
  window.submitToWhatsApp = (formData, formType = 'Website Form') => {
    let msg  = `Hello MBBS Education Orbit Fly,\n\n`;
    msg     += `I'm interested in MBBS in Russia.\n\n`;
    for (const [key, val] of Object.entries(formData)) {
      if (val) msg += `${key}: ${val}\n`;
    }
    msg += `\nForm: ${formType}\nPlease contact me soon. Thank you!`;
    window.open(`https://wa.me/919410494695?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Redirecting to WhatsApp…');
  };

  // Generic delegated handler for all [data-wa-form] forms
  document.querySelectorAll('[data-wa-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = {};
      new FormData(form).forEach((v, k) => { if (v) data[k] = v; });
      submitToWhatsApp(data, form.dataset.waForm || 'Website Form');
    });
  });


  // =========================================
  // HERO SWIPER (index.html only)
  // =========================================
  if (document.querySelector('.hero-swiper')) {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      speed: 1000,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      pagination: { el: '.hero-dots', clickable: true },
      navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' },
    });
  }


  // =========================================
  // TESTIMONIALS SWIPER
  // =========================================
  if (document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      speed: 700,
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: { el: '.testimonials-dots', clickable: true },
      breakpoints: {
        640:  { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }


  // =========================================
  // NAVBAR shrink on scroll
  // =========================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  // =========================================
  // MOBILE MENU
  // =========================================
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen   = document.getElementById('icon-open');
  const iconClose  = document.getElementById('icon-close');

  if (menuBtn && mobileMenu) {
    const closeMobileMenu = () => {
      mobileMenu.style.maxHeight = '0';
      iconOpen?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
    };
    window.closeMobileMenu = closeMobileMenu;

    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== '0px';
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileMenu.style.maxHeight = '560px';
        iconOpen?.classList.add('hidden');
        iconClose?.classList.remove('hidden');
      }
    });
    mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMobileMenu));
  }


  // =========================================
  // COUNTER ANIMATION
  // =========================================
  const counters = document.querySelectorAll('.counter');

  const runCounter = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(e * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObs = new IntersectionObserver(
    entries => entries.forEach(e => e.isIntersecting && runCounter(e.target)),
    { threshold: 0.4 }
  );
  counters.forEach(el => counterObs.observe(el));


  // =========================================
  // SMOOTH SCROLL
  // =========================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const sel = a.getAttribute('href');
      if (sel === '#') return;
      const t = document.querySelector(sel);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });


  // =========================================
  // MODAL — Apply Now
  // =========================================
  const modal = document.getElementById('apply-modal');
  window.openModal  = () => { if (modal) { modal.classList.add('open');    document.body.style.overflow = 'hidden'; } };
  window.closeModal = () => { if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; } };
  document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());


  // =========================================
  // BACK TO TOP
  // =========================================
  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => btt?.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  // =========================================
  // ACCORDION
  // =========================================
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body   = btn.nextElementSibling;
      const isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
      // collapse all
      document.querySelectorAll('.accordion-body').forEach(b => {
        b.style.maxHeight = '0';
        b.previousElementSibling?.querySelector('.acc-icon')?.classList.remove('rotate-180');
      });
      if (!isOpen) {
        body.style.maxHeight = body.scrollHeight + 'px';
        btn.querySelector('.acc-icon')?.classList.add('rotate-180');
      }
    });
  });


  // =========================================
  // UNIVERSITY FILTER + SEARCH
  // =========================================
  const filterBtns   = document.querySelectorAll('.uni-filter-btn');
  const uniCardItems = document.querySelectorAll('.uni-card-item');
  const uniSearch    = document.getElementById('uni-search');

  if (filterBtns.length && uniCardItems.length) {
    const applyFilter = () => {
      const activeBtn = document.querySelector('.uni-filter-btn.active');
      const tag       = activeBtn?.dataset.filter || 'all';
      const query     = uniSearch?.value.toLowerCase().trim() || '';
      uniCardItems.forEach(card => {
        const matchTag    = tag === 'all' || (card.dataset.tags || '').includes(tag);
        const matchSearch = !query || (card.dataset.name || '').toLowerCase().includes(query) || (card.dataset.city || '').toLowerCase().includes(query);
        card.style.display = matchTag && matchSearch ? '' : 'none';
      });
    };
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter();
      });
    });
    uniSearch?.addEventListener('input', applyFilter);
  }


  // =========================================
  // TESTIMONIALS FILTER
  // =========================================
  const testFilterBtns = document.querySelectorAll('.test-filter-btn');
  const testCardItems  = document.querySelectorAll('.test-card-item');

  if (testFilterBtns.length && testCardItems.length) {
    testFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        testFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        testCardItems.forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.uni === filter) ? '' : 'none';
        });
      });
    });
  }


  // =========================================
  // ACTIVE NAV LINK
  // =========================================
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === page) link.classList.add('active');
  });

});
