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

    return () => { revealIo.disconnect(); counterIo.disconnect(); };
  }, []);

  return null;
}
