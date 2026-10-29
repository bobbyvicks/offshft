// Builds the Shopify page and collection inputs from store/pages/*.md and store/collections.md.
// Run: node store/apply/build-content.cjs   (writes store/apply/content.json)
// Pages go in as HTML from each file's paste section; pages that still hold [CONFIRM] blanks stay hidden.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const STORE = path.join(__dirname, '..');

function page(slug, title) {
  const md = fs.readFileSync(path.join(STORE, 'pages', `${slug}.md`), 'utf8');
  const body = md.split('<!-- paste:start -->')[1].split('<!-- paste:end -->')[0].trim();
  const seo = md.match(/\*\*SEO title[^:]*:\*\*\s*(.+)/)[1].trim();
  const meta = md.match(/\*\*Meta description[^:]*:\*\*\s*(.+)/)[1].trim();
  const html = execFileSync('pandoc', ['-f', 'markdown', '-t', 'html', '--wrap=none'], { input: body }).toString().trim();
  const blanks = (body.match(/\[CONFIRM/g) || []).length;
  return {
    title, handle: slug, body: html, isPublished: blanks === 0,
    metafields: [
      { namespace: 'global', key: 'title_tag', type: 'single_line_text_field', value: seo },
      { namespace: 'global', key: 'description_tag', type: 'single_line_text_field', value: meta },
    ],
    blanks,
  };
}

function collections() {
  const md = fs.readFileSync(path.join(STORE, 'collections.md'), 'utf8');
  const out = [];
  for (const part of md.split(/\n## /).slice(1)) {
    const get = (label) => { const m = part.match(new RegExp(`\\*\\*${label}[^:]*:\\*\\*\\s*(.+)`)); return m && m[1].trim(); };
    const handle = get('Handle');
    if (!handle) continue;
    const rule = get('Rule');
    const r = rule.match(/^Product (type|tag) is equal to (.+)$/);
    out.push({
      title: get('Title'), handle, descriptionHtml: `<p>${get('Description')}</p>`,
      seo: { title: get('SEO title'), description: get('Meta description') },
      sortOrder: 'BEST_SELLING',
      // Admin API "sources" (the replacement for ruleSet): one condition on product type or tag
      sources: [{ source: {
        title: rule, targetType: 'PRODUCTS',
        inclusion: { matchType: 'ALL', conditions: [r[1] === 'type'
          ? { productType: { matchType: 'ANY', relation: 'EQUALS', values: [r[2]] } }
          : { productTag: { matchType: 'ANY', relation: 'TAGGED_WITH', values: [r[2]] } }] },
      } }],
    });
  }
  return out;
}

const pages = [page('about', 'About'), page('faq', 'FAQ'), page('shipping-returns', 'Shipping & returns'), page('size-fit', 'Size & fit')];
const cols = collections();
fs.writeFileSync(path.join(__dirname, 'content.json'), JSON.stringify({ pages, collections: cols }, null, 1));
for (const p of pages) console.log('page', p.handle, p.isPublished ? 'published' : `hidden (${p.blanks} blanks)`, p.body.length, 'chars');
for (const c of cols) console.log('collection', c.handle, JSON.stringify(c.sources[0].source.inclusion.conditions[0]));
