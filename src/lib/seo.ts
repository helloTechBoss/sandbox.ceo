const BASE = 'https://www.sandbox.ceo';

export function localeUrl(path: string, locale: string = 'zh-Hant') {
  const prefix = locale === 'zh-Hant' ? '' : `/${locale}`;
  return `${BASE}${prefix}${path === '/' ? '' : path}`;
}

export function hreflang(path: string, locale: string = 'zh-Hant') {
  return {
    canonical: localeUrl(path, locale),
    languages: {
      'zh-Hant': `${BASE}${path === '/' ? '' : path}`,
      'en': `${BASE}/en${path === '/' ? '' : path}`,
      'zh-Hans': `${BASE}/zh-Hans${path === '/' ? '' : path}`,
      'x-default': `${BASE}${path === '/' ? '' : path}`,
    },
  };
}

export function ogMeta(title: string, description: string, url: string) {
  return {
    type: 'website' as const,
    title,
    description,
    url: `https://www.sandbox.ceo${url}`,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
  };
}

export function ogImage(alt: string) {
  return [{ url: '/opengraph-image', width: 1200, height: 630, alt }];
}
