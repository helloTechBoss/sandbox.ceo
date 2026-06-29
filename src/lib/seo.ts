const BASE = 'https://www.sandbox.ceo';

export function hreflang(path: string) {
  return {
    canonical: `${BASE}${path === '/' ? '' : path}`,
    languages: {
      'zh-Hant': `${BASE}${path === '/' ? '' : path}`,
      'en': `${BASE}/en${path === '/' ? '' : path}`,
      'zh-Hans': `${BASE}/zh-Hans${path === '/' ? '' : path}`,
      'x-default': `${BASE}${path === '/' ? '' : path}`,
    },
  };
}

export function ogImage(alt: string) {
  return [{ url: '/og-default.png', width: 1200, height: 630, alt }];
}
