



(() => {
  'use strict';

  if (window.__marvelUI) return;          // load once, whichever page we're on
  window.__marvelUI = true;

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CAN_SMOOTH = 'scrollBehavior' in document.documentElement.style;

  


  const easeInOut = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function scrollToY(y, ms = 620) {
    y = Math.max(0, Math.round(y));
    if (REDUCED) { window.scrollTo(0, y); return; }
    if (CAN_SMOOTH) {
      try { window.scrollTo({ top: y, behavior: 'smooth' }); return; } catch (e) { /* fall through */ }
    }
    /* rAF fallback for browsers without CSS smooth scrolling */
    const start = window.pageYOffset || document.documentElement.scrollTop;
    const dist = y - start;
    if (!dist) return;
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / ms);
      window.scrollTo(0, start + dist * easeInOut(p));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  function scrollToEl(el, offset) {
    if (!el) return;
    const top = el.getBoundingClientRect().top +
      (window.pageYOffset || document.documentElement.scrollTop) -
      (offset == null ? 84 : offset);
    scrollToY(top);
  }

  /* Any scrollIntoView() call in the app becomes a smooth one.
     Native behaviour is preserved for everything else. */
  (function patchScrollIntoView() {
    if (!Element.prototype.scrollIntoView) return;
    const original = Element.prototype.scrollIntoView;
    if (original.__marvelSmooth) return;

    function smooth(arg) {
      let opts = arg;
      if (arg == null) {
        opts = { behavior: REDUCED ? 'auto' : 'smooth' };
      } else if (typeof arg === 'boolean') {
        opts = { behavior: REDUCED ? 'auto' : 'smooth', block: arg ? 'start' : 'end' };
      } else if (typeof arg === 'object') {
        opts = Object.assign({}, arg, { behavior: REDUCED ? 'auto' : 'smooth' });
      }
      try { return original.call(this, opts); }
      catch (e) { return original.call(this, arg); }
    }
    smooth.__marvelSmooth = true;
    try {
      Object.defineProperty(Element.prototype, 'scrollIntoView', {
        value: smooth, writable: true, configurable: true, enumerable: false,
      });
    } catch (e) { /* older engines: leave it alone */ }
  })();

  /* In-page anchor links (#products …) glide down instead of jumping */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const link = (t && t.closest) ? t.closest('a[href^="#"]') : null;
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#' || hash.length < 2) return;   // plain "#" links keep their default
    let target = null;
    try { target = document.querySelector(hash); } catch (err) { return; }
    if (!target) return;
    e.preventDefault();
    scrollToEl(target, 96);
    if (history.replaceState) history.replaceState(null, '', hash);
  }, false);

 


  function ripple(el, e) {
    const box = el.getBoundingClientRect();
    const size = Math.max(box.width, box.height) * 2.1;
    const x = (e && e.clientX != null ? e.clientX - box.left : box.width / 2);
    const y = (e && e.clientY != null ? e.clientY - box.top : box.height / 2);
    const s = document.createElement('span');
    s.className = 'g-ripple';
    s.style.width = s.style.height = size + 'px';
    s.style.left = (x - size / 2) + 'px';
    s.style.top = (y - size / 2) + 'px';
    s.addEventListener('animationend', () => s.remove(), { once: true });
    el.appendChild(s);
  }

  function attachRipple(el) {
    if (el.__ripple || el.disabled) return;
    el.__ripple = true;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('pointerdown', (e) => { if (!REDUCED) ripple(el, e); }, { passive: true });
    el.addEventListener('keydown', (e) => {          // keyboard activation too
      if (!REDUCED && (e.key === 'Enter' || e.key === ' ')) ripple(el, null);
    });
  }

  const RIPPLE_SEL = 'button:not([data-ripple="off"]), a.g-btn, a.hero-cta';

  function attachRipples(root) {
    if (root.matches && root.matches(RIPPLE_SEL)) attachRipple(root);
    if (root.querySelectorAll) root.querySelectorAll(RIPPLE_SEL).forEach(attachRipple);
  }

 



  const REVEAL_SEL = '.cade, .butaddetal, .gen';
  let io = null;

  if (!REDUCED && 'IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-in');
        io.unobserve(el);
        const wait = 700 + (parseFloat(el.style.transitionDelay) || 0);
        setTimeout(() => {                       // hand transitions back to CSS
          el.classList.remove('g-reveal', 'is-in');
          el.style.transitionDelay = '';
        }, wait);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  }

  function tagReveal(root) {
    if (!io) return;
    const list = [];
    if (root.matches && root.matches(REVEAL_SEL)) list.push(root);
    if (root.querySelectorAll) list.push.apply(list, root.querySelectorAll(REVEAL_SEL));
    list.forEach((el, i) => {
      if (el.__reveal) return;
      el.__reveal = true;
      el.classList.add('g-reveal');
      el.style.transitionDelay = Math.min(i, 8) * 55 + 'ms';
      io.observe(el);
    });
  }

  

  const TICK = '<path d="M20 6L9 17l-5-5"/>';
  const BANG = '<path d="M12 5v9"/><path d="M12 18.6h.01"/>';

  function gDialog(opts) {
    opts = opts || {};
    const isError = opts.type === 'error';

    const scrim = document.createElement('div');
    scrim.className = 'g-scrim';
    scrim.innerHTML =
      '<div class="g-dialog' + (isError ? ' is-error' : '') + '" role="dialog" aria-modal="true">' +
        '<span class="g-dialog-badge" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
          'stroke-linecap="round" stroke-linejoin="round">' + (isError ? BANG : TICK) + '</svg>' +
        '</span>' +
        '<h2></h2><p></p><div class="g-dialog-actions"></div>' +
      '</div>';

    const box = scrim.firstElementChild;
    box.querySelector('h2').textContent = opts.title || '';
    box.querySelector('p').textContent = opts.message || '';

    const bar = box.querySelector('.g-dialog-actions');
    const buttons = [];
    let closed = false;

    function close() {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey, true);
      if (opts.onClose) opts.onClose();
      if (!REDUCED) {
        box.style.transition = 'opacity .16s var(--ease-out), transform .16s var(--ease-out)';
        box.style.opacity = '0';
        box.style.transform = 'translateY(10px) scale(.97)';
        scrim.style.transition = 'opacity .16s var(--ease-out)';
        scrim.style.opacity = '0';
        setTimeout(() => scrim.remove(), 180);
      } else {
        scrim.remove();
      }
    }

    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab' && buttons.length) {
        const i = buttons.indexOf(document.activeElement);
        e.preventDefault();
        buttons[(i + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
      }
    }

    (opts.actions || [{ label: 'OK' }]).forEach(function (a) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'g-btn ' + (a.variant === 'text' ? 'g-btn--tonal' : 'g-btn--filled');
      const lbl = document.createElement('span');
      lbl.className = 'g-btn-label';
      lbl.textContent = a.label;
      btn.appendChild(lbl);
      btn.addEventListener('click', function () {
        close();
        if (a.href) location.href = a.href;
        if (a.onClick) a.onClick();
      });
      bar.appendChild(btn);
      buttons.push(btn);
    });

    if (opts.dismissible !== false) {
      scrim.addEventListener('click', function (e) { if (e.target === scrim) close(); });
    }

    document.body.appendChild(scrim);
    attachRipples(scrim);
    document.addEventListener('keydown', onKey, true);
    if (buttons[0]) setTimeout(function () { buttons[0].focus(); }, 60);

    return { close: close, el: scrim };
  }

  /* put a button into a "working…" state; the returned function undoes it */
  function gBusy(btn, label) {
    if (!btn) return function () {};
    const was = btn.innerHTML;
    const wasDisabled = btn.disabled;
    btn.classList.add('is-busy');
    btn.disabled = true;
    const sp = document.createElement('span');
    sp.className = 'g-spinner';
    sp.setAttribute('aria-hidden', 'true');
    const lbl = document.createElement('span');
    lbl.className = 'g-btn-label';
    lbl.textContent = label || 'Please wait\u2026';
    btn.innerHTML = '';
    btn.appendChild(sp);
    btn.appendChild(lbl);
    return function () {
      btn.classList.remove('is-busy');
      btn.disabled = wasDisabled;
      btn.innerHTML = was;
    };
  }

  window.gDialog = gDialog;
  window.gBusy = gBusy;

  

  const SKEL_CARD =
    '<div class="g-skel g-skel--card" aria-hidden="true">' +
      '<i class="sk-img"></i><i class="sk-line sk-w80"></i>' +
      '<i class="sk-line sk-w50"></i><i class="sk-btn"></i>' +
    '</div>';

  const SKEL_ROW =
    '<div class="g-skel g-skel--row" aria-hidden="true">' +
      '<i class="sk-avatar"></i>' +
      '<div class="sk-body"><i class="sk-line sk-w70"></i><i class="sk-line sk-w45"></i></div>' +
      '<i class="sk-pill"></i>' +
    '</div>';

  const isSkel = (n) => n.classList && n.classList.contains('g-skel');

  /* Show shimmering placeholders in a data-driven container until the real
     content arrives, so nobody sees a blank page or an empty-state flash. */
  function skeletonize(el) {
    if (!el || el.__skel) return;
    el.__skel = true;
    if (el.children.length) return;                 // data is already there

    const kind = el.classList.contains('rice') ? 'card' : 'row';
    const n = kind === 'card' ? 8 : 4;
    el.innerHTML = new Array(n).fill(kind === 'card' ? SKEL_CARD : SKEL_ROW).join('');

    const clear = () => {
      if (el.__skelDone) return;
      el.__skelDone = true;
      Array.prototype.slice.call(el.children).forEach((c) => { if (isSkel(c)) c.remove(); });
    };

    const mo = new MutationObserver(() => {
      const real = Array.prototype.some.call(el.children, (c) => !isSkel(c));
      if (real) { clear(); mo.disconnect(); }
    });
    mo.observe(el, { childList: true });

    /* nothing came back (or the list really is empty) — drop the placeholders
       so the .g-empty message can take over */
    setTimeout(() => { clear(); mo.disconnect(); }, 1400);
  }

  function watchContainer(el) {
    if (!el || el.__watched) return;
    el.__watched = true;
    const hasReal = () => Array.prototype.some.call(el.children, (c) => !isSkel(c));
    const settle = () => {
      if (el.__settled) return;
      el.__settled = true;
      setTimeout(() => el.classList.add('is-settled'), 950);
    };
    if (hasReal()) settle();
    new MutationObserver(() => { if (hasReal()) settle(); })
      .observe(el, { childList: true });
  }

  

  function bump(el) {
    if (REDUCED) return;
    el.classList.remove('is-bumping');
    void el.offsetWidth;                        // restart the animation
    el.classList.add('is-bumping');
    setTimeout(() => el.classList.remove('is-bumping'), 600);
  }

  function watchBadge() {
    const badge = document.querySelector('.cart-count');
    if (!badge || badge.__watched) return;
    badge.__watched = true;
    let last = badge.textContent;
    new MutationObserver(() => {
      if (badge.textContent === last) return;    // ignore innerHTML churn that changes nothing
      last = badge.textContent;
      bump(badge);
    }).observe(badge, { childList: true, characterData: true, subtree: true });
  }

  function countUp(el) {
    if (el.__counted) return;
    el.__counted = true;

    /* keep whatever sits around the number — e.g. the ₦ sign before it */
    const m = (el.textContent || '').trim().match(/^([^0-9]*)([0-9][0-9.,]*)([^0-9]*)$/);
    if (!m) return;
    const before = m[1], after = m[3];
    const num = Number(m[2].replace(/,/g, ''));
    if (!isFinite(num) || num <= 0) return;

    const write = (v) => { el.textContent = before + v.toLocaleString('en-NG') + after; };

    if (REDUCED) { write(num); return; }

    const dur = Math.min(1200, 420 + String(Math.round(num)).length * 60);
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      write(Math.round(num * eased));
      if (p < 1) requestAnimationFrame(step); else write(num);
    })(t0);
  }

  function animateCounters(root) {
    if (root.matches && root.matches('.total-price')) countUp(root);
    if (root.querySelectorAll) root.querySelectorAll('.total-price').forEach(countUp);
  }

  

  let progress = null, fab = null, bars = [];

  function buildScrollChrome() {
    progress = document.createElement('div');
    progress.className = 'g-progress';
    progress.setAttribute('aria-hidden', 'true');

    fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'g-fab';
    fab.setAttribute('aria-label', 'Back to top');
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    fab.addEventListener('click', () => scrollToY(0, 640));

    bars = Array.prototype.slice.call(
      document.querySelectorAll('.navbar, .gbar, .nave, .nav, .abar'));

    document.body.appendChild(progress);
    document.body.appendChild(fab);
    attachRipple(fab);
  }

  /* cat.js swaps document.body.innerHTML when you log in or out, which would
     throw the progress line and the FAB away with it — put them back. */
  function ensureChrome() {
    if (!progress || !document.body) return;
    if (!document.body.contains(progress)) document.body.appendChild(progress);
    if (fab && !document.body.contains(fab)) document.body.appendChild(fab);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = window.pageYOffset || document.documentElement.scrollTop;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress) progress.style.transform = 'scaleX(' + Math.min(1, y / max).toFixed(4) + ')';
      if (fab) fab.classList.toggle('is-vis', y > 420);
      for (let i = 0; i < bars.length; i++) bars[i].classList.toggle('is-stuck', y > 6);
    });
  }


  function process(root) {
    if (!root || root.nodeType !== 1) return;
    tagReveal(root);
    attachRipples(root);
    animateCounters(root);
    if (root.matches && root.matches('.rice, .section')) { skeletonize(root); watchContainer(root); }
    if (root.querySelectorAll) {
      root.querySelectorAll('.rice, .section').forEach((c) => { skeletonize(c); watchContainer(c); });
    }
  }

  function boot() {
    buildScrollChrome();

    /* data-driven lists: show placeholders first, then handle real content */
    document.querySelectorAll('[data-empty]').forEach(skeletonize);
    process(document.body);
    watchBadge();

    new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) process(node);
        }
      }
      watchBadge();      // cat.js can swap the whole body out
      ensureChrome();
      bars = Array.prototype.slice.call(
        document.querySelectorAll('.navbar, .gbar, .nave, .nav, .abar'));
    }).observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    /* mark the current page's nav item, if it has one */
    const here = location.pathname.split('/').pop() || 'costom_ui.html';
    document.querySelectorAll('.gnav-link, .navbar > a:not(.cart)').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href && href.split('/').pop() === here) a.classList.add('is-active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
