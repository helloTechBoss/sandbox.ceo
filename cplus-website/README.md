# CPLUS COMPLIANCE 協加合規 — Website

Single-file static website. Everything (styles, scripts, images, logo) is embedded in `index.html` — no build step, no dependencies, no server-side code.

## Deploy options (pick one)

**Netlify (easiest, free)**
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page — done, you get a live URL.

**Vercel**
```bash
npx vercel --prod
```

**GitHub Pages**
1. Create a repo, upload `index.html`
2. Settings → Pages → Deploy from branch → main → root

**Any web host / cPanel**
Upload `index.html` to the public_html / www root. That's it.

## Custom domain
After deploying, point your domain (e.g. cpluscompliance.com) at the host per their instructions, and keep the Google Search Console verification if added later.

## Site structure (all inside index.html)
- SPA with hash routing: #home #mso #licensing #compliance #corporate #marketplace #about #contact
- Traditional Chinese content, WhatsApp CTAs (+852 9488 4416)
- Entity: CPLUS GROUP (HK) LIMITED 協加集團(香港)有限公司, trading as CPLUS COMPLIANCE 協加合規, TCSP TC009188
- Address: Unit 1001-02, 10/F, Golden Centre, 188 Des Voeux Road Central, Sheung Wan, HK

## Prompt for Claude (give this to your Claude Code)
> Deploy the static site in this folder. It is a single self-contained index.html with no build step. Put it on [Netlify/Vercel/GitHub Pages — pick one] and give me the live URL. Do not modify the HTML content.
