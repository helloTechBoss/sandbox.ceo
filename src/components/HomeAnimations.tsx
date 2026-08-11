'use client';
import { useEffect } from 'react';

export default function HomeAnimations() {
  useEffect(() => {
    // ── Scroll reveal ──────────────────────────────────────────
    const reveals = document.querySelectorAll('.reveal');
    const revealIo = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); revealIo.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => revealIo.observe(el));

    // ── Count-up ───────────────────────────────────────────────
    const counters = document.querySelectorAll<HTMLElement>('[data-count]');
    const counterIo = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const target = parseFloat(el.dataset.count || '0');
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const isFloat = el.dataset.float === '1';
        const duration = 1800;
        const startTime = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = eased * target;
          el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val).toString()) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterIo.unobserve(el);
      }),
      { threshold: 0.6 }
    );
    counters.forEach(el => counterIo.observe(el));

    // ── Hover glow on division cards ───────────────────────────
    document.querySelectorAll<HTMLElement>('.div-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-6px)';
        card.style.boxShadow = '0 16px 40px rgba(239,68,68,.18)';
        card.style.borderBottom = '3px solid #EF4444';
        card.style.zIndex = '2';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.borderBottom = '';
        card.style.zIndex = '';
      });
    });

    // ── Hover glow on service cards ────────────────────────────
    document.querySelectorAll<HTMLElement>('.svc-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.background = '#163070';
        card.style.boxShadow = '0 0 0 2px #C9A84C inset';
        card.style.transform = 'translateY(-4px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.background = '';
        card.style.boxShadow = '';
        card.style.transform = '';
      });
    });

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    // ── Click burst particles ──────────────────────────────────
    const COLORS = ['#EF4444', '#C9A84C', '#fff', '#EF4444', '#C9A84C'];
    const burst = (x: number, y: number) => {
      const count = 10;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        const angle = (360 / count) * i;
        const distance = 40 + Math.random() * 40;
        const size = 4 + Math.random() * 4;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * distance;
        const ty = Math.sin(rad) * distance;
        dot.style.cssText = `
          position:fixed; left:${x}px; top:${y}px; width:${size}px; height:${size}px;
          border-radius:50%; background:${color}; pointer-events:none; z-index:99999;
          transform:translate(-50%,-50%);
          animation:burst-dot .7s ease-out forwards;
          --tx:${tx}px; --ty:${ty}px;
        `;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 700);
      }
    };

    const handleClick = (e: MouseEvent) => burst(e.clientX, e.clientY);
    document.addEventListener('click', handleClick);

    // ── Hero parallax on mouse move ────────────────────────────
    let heroParallaxActive = false;
    const heroImg = document.querySelector<HTMLElement>('.hero-img');
    const heroText = document.querySelector<HTMLElement>('.hero-parallax-text');
    const heroParticles = document.querySelectorAll<HTMLElement>('.hero-particle');

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      const { innerWidth: w, innerHeight: h } = window;
      const mx = (e.clientX / w - 0.5) * 2; // -1 to 1
      const my = (e.clientY / h - 0.5) * 2;
      if (heroImg) {
        heroImg.style.transform = `scale(1.06) translate(${mx * 8}px, ${my * 6}px)`;
      }
      if (heroText) {
        heroText.style.transform = `translate(${mx * -12}px, ${my * -8}px)`;
      }
      heroParticles.forEach((p, i) => {
        const factor = (i % 3 + 1) * 5;
        p.style.transform = `translate(${mx * factor}px, ${my * factor}px)`;
      });
    };

    const heroSection = document.querySelector<HTMLElement>('.hero-section');
    if (heroSection && !isMobile) {
      heroSection.addEventListener('mousemove', handleMouseMove);
      heroSection.addEventListener('mouseleave', () => {
        if (heroImg) heroImg.style.transform = '';
        if (heroText) heroText.style.transform = '';
        heroParticles.forEach(p => { p.style.transform = ''; });
      });
      heroParallaxActive = true;
    }

    // ── Magnetic buttons ───────────────────────────────────────
    const magnetBtns: HTMLElement[] = [];
    if (!isMobile && !isTouchDevice) {
      document.querySelectorAll<HTMLElement>('.magnet-btn').forEach(btn => {
        const handleBtnMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * 0.3;
          const dy = (e.clientY - cy) * 0.3;
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        };
        const handleBtnLeave = () => {
          btn.style.transform = '';
          btn.style.transition = 'transform .4s cubic-bezier(.23,1,.32,1)';
          setTimeout(() => { btn.style.transition = ''; }, 400);
        };
        btn.addEventListener('mousemove', handleBtnMove);
        btn.addEventListener('mouseleave', handleBtnLeave);
        magnetBtns.push(btn);
      });
    }

    // ── Spotlight glow on dark sections ───────────────────────
    const spotlightSections = document.querySelectorAll<HTMLElement>('.spotlight-section');
    const spotlightHandlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = [];
    if (!isMobile) {
      spotlightSections.forEach(section => {
        const fn = (e: MouseEvent) => {
          const rect = section.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          section.style.setProperty('--sx', `${x}px`);
          section.style.setProperty('--sy', `${y}px`);
        };
        section.addEventListener('mousemove', fn);
        spotlightHandlers.push({ el: section, fn });
      });
    }

    // Inject burst keyframe style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes burst-dot {
        0%   { opacity:1; transform:translate(-50%,-50%) translate(0,0) scale(1); }
        100% { opacity:0; transform:translate(-50%,-50%) translate(var(--tx),var(--ty)) scale(0); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      revealIo.disconnect();
      counterIo.disconnect();
      document.removeEventListener('click', handleClick);
      if (heroSection && heroParallaxActive) {
        heroSection.removeEventListener('mousemove', handleMouseMove);
      }
      spotlightHandlers.forEach(({ el, fn }) => el.removeEventListener('mousemove', fn));
      style.remove();
    };
  }, []);

  return null;
}
