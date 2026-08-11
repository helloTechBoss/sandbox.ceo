'use client';
import { useEffect } from 'react';

export default function HomeAnimations() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine   = window.matchMedia('(pointer:fine)').matches;
    const mobile = window.matchMedia('(max-width: 768px)').matches;

    // ── Scroll reveal ──────────────────────────────────────────
    const revealIo = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); revealIo.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => revealIo.observe(el));

    // ── Count-up ───────────────────────────────────────────────
    const counterIo = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const target = parseFloat(el.dataset.count || '0');
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const isFloat = el.dataset.float === '1';
        const dur = 1800; const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
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
    document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => counterIo.observe(el));

    // ── Scroll progress bar ────────────────────────────────────
    const sp = document.getElementById('sb-progress');
    const onScroll = () => {
      if (!sp) return;
      const h = document.documentElement;
      sp.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    };
    if (sp && !reduce) addEventListener('scroll', onScroll, { passive: true });

    // ── Custom cursor (desktop only) ───────────────────────────
    let dot: HTMLDivElement | null = null;
    let ring: HTMLDivElement | null = null;
    let curRaf: number | null = null;
    if (fine && !mobile && !reduce) {
      dot = document.createElement('div'); dot.className = 'sb-cur-dot';
      ring = document.createElement('div'); ring.className = 'sb-cur-ring';
      document.body.appendChild(dot); document.body.appendChild(ring);
      let mx = 0, my = 0, rx = 0, ry = 0;
      const onMove = (e: MouseEvent) => {
        mx = e.clientX; my = e.clientY;
        dot!.style.left = mx + 'px'; dot!.style.top = my + 'px';
        const t = (e.target as Element).closest('a,button,.div-card,.svc-card,.magnet-btn');
        document.body.classList.toggle('sb-cur-hover', !!t);
      };
      const loop = () => {
        rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
        ring!.style.left = rx + 'px'; ring!.style.top = ry + 'px';
        curRaf = requestAnimationFrame(loop);
      };
      addEventListener('mousemove', onMove);
      curRaf = requestAnimationFrame(loop);
    }

    // ── Click ripple ring ──────────────────────────────────────
    const onClickRipple = (e: MouseEvent) => {
      const fx = document.createElement('div');
      fx.className = 'sb-click-fx';
      fx.style.left = e.clientX + 'px'; fx.style.top = e.clientY + 'px';
      document.body.appendChild(fx);
      setTimeout(() => fx.remove(), 600);
    };
    addEventListener('click', onClickRipple);

    // ── Hero gradient blobs ────────────────────────────────────
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow && fine && !reduce) {
      const heroSection = document.querySelector('.hero-section') as HTMLElement | null;
      const onHeroMove = (e: MouseEvent) => {
        const r = heroSection!.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        (heroGlow as HTMLElement).style.transform = `translate(${x * 30}px,${y * 20}px)`;
      };
      heroSection?.addEventListener('mousemove', onHeroMove);
      heroSection?.addEventListener('mouseleave', () => { (heroGlow as HTMLElement).style.transform = ''; });
    }

    // ── Hero floating dust particles ───────────────────────────
    const dust = document.querySelector('.hero-dust');
    if (dust && !reduce) {
      for (let i = 0; i < 20; i++) {
        const d = document.createElement('i');
        const sz = 3 + Math.random() * 6;
        d.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;`;
        d.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
        d.style.animationDuration = (7 + Math.random() * 9) + 's';
        d.style.animationDelay = (Math.random() * 10) + 's';
        dust.appendChild(d);
      }
    }

    // ── 3D card tilt ──────────────────────────────────────────
    if (fine && !reduce) {
      document.querySelectorAll<HTMLElement>('.div-card,.svc-card').forEach(card => {
        const onTMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
        };
        const onTLeave = () => { card.style.transform = ''; };
        card.addEventListener('mousemove', onTMove);
        card.addEventListener('mouseleave', onTLeave);
      });
    }

    // ── Magnetic buttons ───────────────────────────────────────
    if (fine && !reduce) {
      document.querySelectorAll<HTMLElement>('.magnet-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - r.left - r.width / 2) * 0.3;
          const dy = (e.clientY - r.top - r.height / 2) * 0.3;
          btn.style.transform = `translate(${dx}px,${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
          btn.style.transition = 'transform .4s cubic-bezier(.23,1,.32,1)';
          setTimeout(() => { btn.style.transition = ''; }, 400);
        });
      });
    }

    // ── Div/svc card base hover glow ───────────────────────────
    document.querySelectorAll<HTMLElement>('.div-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 16px 40px rgba(239,68,68,.18)';
        card.style.borderBottom = '3px solid #EF4444';
        card.style.zIndex = '2';
      });
      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = ''; card.style.borderBottom = ''; card.style.zIndex = '';
      });
    });
    document.querySelectorAll<HTMLElement>('.svc-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.background = '#163070';
        card.style.boxShadow = '0 0 0 2px #C9A84C inset';
      });
      card.addEventListener('mouseleave', () => {
        card.style.background = ''; card.style.boxShadow = '';
      });
    });

    // ── Spotlight on dark sections ─────────────────────────────
    if (fine && !reduce) {
      document.querySelectorAll<HTMLElement>('.spotlight-section').forEach(section => {
        section.addEventListener('mousemove', (e: MouseEvent) => {
          const r = section.getBoundingClientRect();
          section.style.setProperty('--sx', (e.clientX - r.left) + 'px');
          section.style.setProperty('--sy', (e.clientY - r.top) + 'px');
        });
      });
    }

    return () => {
      revealIo.disconnect(); counterIo.disconnect();
      removeEventListener('scroll', onScroll);
      removeEventListener('click', onClickRipple);
      dot?.remove(); ring?.remove();
      if (curRaf) cancelAnimationFrame(curRaf);
      document.body.classList.remove('sb-cur-hover');
    };
  }, []);

  return null;
}
