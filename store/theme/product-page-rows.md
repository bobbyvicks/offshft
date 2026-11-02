# Product page rows, policies and footer: the pastes

Written 2 Nov 2026; the owner did all three pastes the same day (checked from the theme and policy data at 04:28 UTC).
Kept as the record of what went in. The live theme ("OFF SHFT — Complete Catalogue") can't be edited from the agent's
connection (only draft themes can), and the Policies settings need a permission it doesn't have, so these were pastes. Everything else from the same pass is already live: the size charts on every clothing listing (product metafield
`custom.size_chart`, from `size-charts.cjs`), the Size & fit page with charts for every style, the footer menu, the
listing text, and the shipping rates (your General profile covers Canada and the US at C$12, free from C$75).

## 1. The three rows on every product page

Online Store > Themes > Customize (the live theme) > open any product page > in the left panel: Product information >
Product details > Accordion. Three rows there, Shipping, Returns and Size & fit, each hold one Text block that only
links to a page. Replace the text in each:

**Shipping** (Text block):

Made to order, usually in 2–5 business days, then 3–5 more in the post. About 1–2 weeks all in, sometimes longer. If you order a few things, they can come in separate boxes.

We ship to Canada and the US. Standard shipping is C$12 an order and free from C$75. Prices are in Canadian dollars. US orders can be charged duties or import fees when they arrive.

[link "Shipping & returns" to /pages/shipping-returns]

**Returns** (Text block):

Each piece is made for your order, so we can't take returns or exchanges if you change your mind or it doesn't fit. Check Size & fit before you order.

If it shows up damaged, made wrong or not what you ordered, message us your order number within 14 days of delivery. We'll ask for a photo, then replace it or refund you. No need to send it back.

Not here 15 business days after it shipped? Let us know and we'll replace it or refund you.

[link "message us" and "Let us know" to /pages/contact]

**Size & fit** (delete the Text block, add a block > Custom Liquid, paste this):

```liquid
{%- assign chart = product.metafields.custom.size_chart.value -%}
{%- if chart -%}
  <p>Flat measurements, in cm (inches in brackets). Chest is straight across, armpit to armpit; length is from where the shoulder meets the collar down to the hem; sweatpants are the waistband across and the inseam. Any piece can be up to 5 cm (2 in) off.</p>
  {%- for t in chart.tables -%}
    <table>
      <thead><tr><th>{{ t.title }}</th>{% for c in t.columns %}<th>{{ c }}</th>{% endfor %}</tr></thead>
      <tbody>{% for r in t.rows %}<tr>{% for cell in r %}<td>{{ cell }}</td>{% endfor %}</tr>{% endfor %}</tbody>
    </table>
  {%- endfor -%}
  {%- if chart.note -%}<p>{{ chart.note }}</p>{%- endif -%}
  <p>Stuck between two sizes? <a href="/pages/contact">Send us your measurements</a> and we'll help you pick. All the charts: <a href="/pages/size-fit">Size &amp; fit</a>.</p>
{%- else -%}
  <p>One size. Caps adjust at the back: the Retro Trucker and 5-Panel are firm up front, the Rope Cap is softer, and the Dad Hat is soft with a strap and buckle. Beanies and bucket hats don't adjust. More on <a href="/pages/size-fit">Size &amp; fit</a>.</p>
{%- endif -%}
```

The chart comes from each listing's own data, so hoodies show their three styles, the golf shirt its three, hats the
one-size line. To change a chart later, edit `size-charts.cjs` and ask the agent to push it (one call).

## 2. Policies (Settings > Policies)

These show at checkout and in the footer's policy list (which lists only the privacy policy today).

**Shipping policy**

Everything's made to order, which usually takes 2–5 business days, and shipping is about 3–5 more. All in, that's about 1–2 weeks, sometimes longer. If you order a few things, they can come in separate boxes.

We ship to Canada and the US. Standard shipping is C$12 an order and free on orders of C$75 or more. Prices are in Canadian dollars, even for US orders.

Prices and shipping don't include duties or import fees. Your order might ship from another country, and we can't tell ahead of time. If it does, the carrier may charge them when it arrives.

To change or cancel, message us your order number through the Contact page as soon as you can. Once we've started making it, it's too late, and we can't always catch it in time.

**Refund policy**

We can't do returns or exchanges if you change your mind or it doesn't fit. Each piece is made for your order, so there's no shelf to put it back on. Check the Size & fit page before you order. Garment-dyed colours can be a shade off the photo.

If anything shows up damaged, made wrong or not what you ordered, that's on us. Message us your order number through the Contact page within 14 days of delivery. We'll ask for a photo, then replace it or refund you. No need to send it back.

If your order hasn't arrived 15 business days after it ships, let us know. If it's lost, we'll replace it or refund you.

## 3. Footer links

The footer's "Explore" column is three hand-made links in the theme (Shop, About, Contact), not a menu. The Footer menu
in Navigation now has Shop, Size & fit, Shipping & returns, FAQ, Contact, About, Search and Your Privacy Choices. To show
it: Customize > Footer > the "Explore OFF SHFT" group > add a block > Menu > pick "Footer menu", then delete the three
text links. Or add three more text links by hand.

The Contact page already has a form (its template includes one), so nothing to do there.
