const BASE = 'https://www.sandbox.ceo';

export function OrgJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'FinancialService'],
    name: 'Sandbox Group',
    alternateName: ['Tech Boss Limited', 'Sandbox.CEO'],
    url: BASE,
    logo: `${BASE}/logo.png`,
    image: `${BASE}/og-default.png`,
    description: 'Hong Kong compliance and licensing specialists — MSO, SFC, AML, corporate services and RegTech solutions.',
    telephone: '+85292318254',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Room 1002B, 10/F, Metro Centre II, 21 Lam Hing Street',
      addressLocality: 'Kowloon Bay',
      addressRegion: 'Kowloon',
      addressCountry: 'HK',
      postalCode: '',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+85292318254',
      availableLanguage: ['Chinese', 'English'],
    },
    sameAs: [],
    areaServed: { '@type': 'Country', name: 'Hong Kong' },
    serviceArea: { '@type': 'Country', name: 'Hong Kong' },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ServiceJsonLd({ name, description, url }: { name: string; description: string; url: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${BASE}${url}`,
    provider: {
      '@type': 'Organization',
      name: 'Sandbox Group',
      url: BASE,
    },
    areaServed: { '@type': 'Country', name: 'Hong Kong' },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ArticleJsonLd({ title, description, slug, publishedAt, modifiedAt }: {
  title: string; description: string; slug: string; publishedAt?: Date | null; modifiedAt?: Date | null;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${BASE}/insights/${slug}`,
    datePublished: publishedAt?.toISOString(),
    dateModified: modifiedAt?.toISOString() ?? publishedAt?.toISOString(),
    author: { '@type': 'Organization', name: 'Sandbox Group', url: BASE },
    publisher: {
      '@type': 'Organization',
      name: 'Sandbox Group',
      logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
