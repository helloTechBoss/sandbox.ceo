import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

const HTML_PATH = "/Users/kelvin/Downloads/index (34).html";
const OUT_PATH = path.join(__dirname, "extracted-content.json");

const PREFIX_TO_SLUG: Record<string, string | null> = {
  nav: null,
  home: "home",
  svc: "home",
  div1: "home",
  div2: "home",
  div3: "home",
  div4: "home",
  hcorp1: "home",
  hcorp2: "home",
  hcorp3: "home",
  hcorp4: "home",
  hcorp5: "home",
  mob: null,
  about: "about",
  mso: "mso",
  lic: "licensing",
  acct: "corporate",
  cs: "corporate",
  com: "compliance",
  corp: "corporate",
  tech: "tech",
  ins: "insights",
  contact: "contact",
  terms: "terms",
  priv: "privacy",
  privacy: "privacy",
  footer: null,
};

function keyToSlug(key: string): string | null {
  const prefix = key.split(".")[0];
  if (prefix in PREFIX_TO_SLUG) return PREFIX_TO_SLUG[prefix];
  return null;
}

function extractLangData(html: string): { en: Record<string, string>; sc: Record<string, string> } {
  const start = html.indexOf("const LANG_DATA = {");
  if (start === -1) throw new Error("LANG_DATA not found");

  // Find matching closing `};` by tracking brace depth
  let depth = 0;
  let i = start + "const LANG_DATA = ".length;
  let objStart = i;
  let objEnd = -1;
  for (; i < html.length; i++) {
    if (html[i] === "{") depth++;
    else if (html[i] === "}") {
      depth--;
      if (depth === 0) {
        objEnd = i + 1;
        break;
      }
    }
  }
  if (objEnd === -1) throw new Error("Could not find end of LANG_DATA");

  const rawObj = html.slice(objStart, objEnd);

  // Strip JS comments before eval
  const cleaned = rawObj.replace(/\/\*[\s\S]*?\*\//g, "");

  // Use Function constructor to safely evaluate the object literal
  const langData = new Function(`return ${cleaned}`)() as {
    en: Record<string, string>;
    sc: Record<string, string>;
  };
  return langData;
}

function main() {
  const html = fs.readFileSync(HTML_PATH, "utf-8");
  const langData = extractLangData(html);

  const $ = cheerio.load(html);

  const sections: Array<{
    key: string;
    pageSlug: string | null;
    tc: string;
    en: string;
    sc: string;
  }> = [];

  const seenKeys = new Set<string>();

  $("[data-i18n]").each((_i, el) => {
    const key = $(el).attr("data-i18n");
    if (!key || seenKeys.has(key)) return;
    seenKeys.add(key);

    const tc = $(el).html()?.trim() ?? "";
    const en = langData.en[key] ?? "";
    const sc = langData.sc[key] ?? "";
    const pageSlug = keyToSlug(key);

    sections.push({ key, pageSlug, tc, en, sc });
  });

  const settings = [
    { key: "whatsapp_number", value: "+85292318254" },
    { key: "contact_email", value: "" },
    { key: "ga_id", value: "G-L0G2K4FMY2" },
  ];

  const output = { sections, settings };
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`Extracted ${sections.length} sections → ${OUT_PATH}`);
}

main();
