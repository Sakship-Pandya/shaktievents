# SEO launch checklist

The order matters. Steps 1–3 must be done before the site is public; everything
after can follow in the first week.

Run `pnpm smoke:strict` against the live URL when you think you are done — it
fails on exactly the things this list is about.

---

## 1. Before the domain points at it

- [ ] **`NEXT_PUBLIC_SITE_URL` is the real domain**, with `https://` and no
      trailing slash. Every canonical, every hreflang and the sitemap are built
      from it. Get this wrong and the live site tells Google its canonical is
      `localhost`.
- [ ] **Pick one hostname and keep it.** `shreeshaktimandap.com` or
      `www.shreeshaktimandap.com`, not both. Set the other to redirect at the
      DNS or host level. Two hostnames serving the same pages is the single
      most common self-inflicted ranking problem.
- [ ] **Business details are filled in.** Settings › everything showing `[TBD]`.
      Until they are, the live site shows `[TBD]` to visitors — which is
      deliberate, and which you do not want on launch day.
      Check with: `pnpm smoke:strict` (it lists every page still showing one).
- [ ] **The phone number and WhatsApp number work.** Tap them on a real phone.
      Until they are set, every call and WhatsApp button quietly falls back to
      `/contact` rather than to a dead `tel:` link.
- [ ] **Read the privacy policy and terms.** They were drafted from what this
      site actually does — the real form fields, the three services it talks to,
      the one cookie it sets — not from a template. They still deserve five
      minutes from someone who knows your business.

## 2. The day it goes live

- [ ] **Check `robots.txt` on the live domain.** It must allow crawling and
      point at `https://yourdomain/sitemap.xml`. A staging `Disallow: /` that
      survives to production is invisible and costs months.
- [ ] **Open `/sitemap.xml`.** Roughly 120 URLs, both languages, no `/admin`,
      no `/api`.
- [ ] **Search Console: add the property**, verify by DNS (survives a host
      change), submit the sitemap.
- [ ] **Search Console › URL inspection** on the home page and one service
      page. "URL is on Google" will take a few days; what you are checking now
      is that it can be fetched and rendered.
- [ ] **Bing Webmaster Tools.** Two minutes, imports from Search Console. Not
      nothing in a district where a lot of people use whatever the phone shipped
      with.

## 3. Google Business Profile — the one that actually brings the calls

For a local contractor this outranks everything else on this page.

- [ ] **Claim and verify the profile.** Postcard or video, whichever they offer.
- [ ] **Name, address and phone byte-identical to Settings.** Not "Shree Shakti
      Sound & Mandap" here and "Shree Shakti Sound Service & Mandap Contractor"
      there. Same abbreviations, same punctuation, same everything.
- [ ] **Category:** Wedding service / Tent rental service / Event planner —
      pick the primary one that matches most of your work, then add the others.
- [ ] **Service area:** every taluka you actually travel to. It should match the
      towns listed under Areas on the site.
- [ ] **Website link → the home page**, not a Facebook page.
- [ ] **Photographs:** twenty of your own work, geotagged if the phone did it.
      This is the same set you are uploading to the portfolio anyway.
- [ ] **Ask for reviews on the profile, not on the website.** Google reviews
      move rankings; reviews typed into your own site do not. Put the ones you
      collect in both places.

## 4. The first week

- [ ] **Analytics.** Settings takes a GA4 or GTM ID. Add one and you get to see
      which service pages bring enquiries; leave it blank and the site runs with
      no third-party tracking at all. Both are defensible — decide deliberately.
- [ ] **Watch Search Console › Pages.** Some URLs will say "Crawled – currently
      not indexed" for a fortnight. That is normal for a new site and is not a
      fault to chase.
- [ ] **Check hreflang is accepted.** Search Console › International targeting.
      Both language versions of a page should reference each other. This site
      declares `en-IN`, `gu-IN` and `x-default`.
- [ ] **Test the structured data** — [Rich Results Test](https://search.google.com/test/rich-results)
      on the home page (LocalBusiness), a service page (Service + Breadcrumb),
      `/faq` (FAQPage) and a guide (Article + Breadcrumb).
- [ ] **Note the deliberate absence of `aggregateRating`.** The site does not
      claim a star rating, because it has no reviews to average. Once real
      reviews exist, that is a decision to revisit — not before.
- [ ] **Listings:** JustDial, IndiaMART, Sulekha, WeddingWire/WedMeGood, the
      local Facebook groups. Same NAP everywhere, every time.

## 5. Every month, ten minutes

- [ ] **One new project with photographs.** This matters more than everything
      else on this list combined. A mandap contractor's website ranks on
      evidence of work, and evidence of work is photographs with dates and
      places on them.
- [ ] **Search Console › Queries.** Anything you are on page two for is a page
      worth improving. Anything people search that you do not have a page for is
      a page worth writing.
- [ ] **Ask two happy families for a Google review.** Two a month is
      twenty-four a year, which in this district is a lot.
- [ ] **Check the announcement bar still says something true.**

---

## Things this site already does, so you do not have to

Listed so nobody pays a consultant to add them again:

|                              |                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canonical on every page      | Self-referencing, absolute, built from `NEXT_PUBLIC_SITE_URL`                                                                                     |
| hreflang                     | `en-IN`, `gu-IN` and `x-default` on every page, both ways                                                                                         |
| Sitemap                      | One file, both languages, alternates on each entry, regenerated hourly                                                                            |
| `robots.txt`                 | Allows the site, blocks `/admin` and `/api`, points at the sitemap                                                                                |
| Structured data              | LocalBusiness on the home page, contact, about and every town page; Service; BreadcrumbList; FAQPage; Article; Event and ImageGallery on projects |
| Open Graph and Twitter cards | Generated per page, with a rendered OG image                                                                                                      |
| Image sitemap                | `/image-sitemap.xml`, separate from the page sitemap                                                                                              |
| Mobile                       | Every page audited; a fixed call/WhatsApp bar on phones                                                                                           |
| Speed                        | Static pages regenerated hourly; mobile Lighthouse 93–97                                                                                          |
| Accessibility                | 100 on every audited page — which Google reads as quality                                                                                         |

## What it deliberately does not do

|                                | Why                                                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| No `aggregateRating`           | There are no reviews to average. Inventing one is a manual-action risk, not a shortcut.                                             |
| No fake "500+ events" counters | The stats row stays hidden until real numbers are entered.                                                                          |
| No stock photographs           | Placeholders are visibly labelled as placeholders. A stock mandap on a mandap contractor's site is the first thing a visitor spots. |
| No keyword-stuffed town pages  | Twelve real towns with real venue lists beats fifty thin pages, and does not risk a doorway-page penalty.                           |
| No taluka map                  | An inaccurate map of a real district is worse than no map. Add one when there is real boundary data.                                |
