# Content review before launch

> Part of the handover pack: this file is what is still waiting on you,
> [`seo-launch-checklist.md`](seo-launch-checklist.md) is what to do at launch,
> and [`admin-guide.md`](admin-guide.md) / [`admin-guide.gu.md`](admin-guide.gu.md)
> is how to run the site day to day — also at `/admin/help`.

Everything on the site is either a fact the client supplied, a `[TBD]` marker, or
copy written to be checked. This page lists what needs confirming and who can
change it.

## 1. Business facts — currently `[TBD]`

Fill these in at **/admin/settings**. Until they are set, the public site shows a
visible `[TBD]` marker rather than a guess, and the call/WhatsApp buttons fall
back to the contact page instead of rendering a dead link.

| Field                                     | Where it shows                                 |
| ----------------------------------------- | ---------------------------------------------- |
| Primary phone                             | Announcement bar, header, footer, mobile bar   |
| WhatsApp number                           | Every WhatsApp button on the site              |
| Email                                     | Footer, contact page                           |
| Address line, area                        | Footer, contact page, LocalBusiness schema     |
| Google Maps / Business Profile links      | Footer                                         |
| Established year                          | Hero eyebrow ("since …") and the years counter |
| Owner name, GST number                    | About page, footer                             |
| Events completed, crew size, towns served | Hero stat counters                             |
| Social links                              | Footer                                         |

## 2. Specifications tables — confirm against your own equipment

Each service page has a **Sizes and specifications** table. Where CLAUDE.md gave
figures (German hanger spans of 15–30 m, 500–10,000 guests, sound systems of
5,000–100,000 W, seating for 200–5,000) those are used as supplied. The rest are
conservative, typical trade ranges — for example mandap footprints of 10×10 ft to
20×20 ft and stage heights of 1–4 ft.

**These need checking against what Shree Shakti actually owns.** Any figure that
is wrong is wrong on a page that ranks, so it is worth an hour with the godown
list. Edit them at **/admin/services → (service) → Sizes and specifications**.

## 3a. The quote estimator — deliberately silent

The quote form at `/get-quote` ends with a rough range. It only shows one once
base prices are set at **/admin/settings/estimator**. With none set — the state
it ships in — it collects the enquiry and tells the visitor a quote follows a
site visit, which is the same position the service pages take.

Setting prices there changes what a stranger is shown before you have spoken to
them, so it is worth doing deliberately:

| Setting                | What it does                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------- |
| Base price per service | The starting figure for a typical job. Blank means the estimator ignores that service. |
| Guest bands            | Multiplies the total by guest count. Bands match smallest first.                       |
| Peak months            | Applies the season multiplier, and warns visitors that their date is in lagan season.  |
| Range width            | How wide the quoted band is, either side of the calculated figure.                     |
| Minimum total          | Nothing is quoted below this.                                                          |

The range is always labelled an estimate rather than a quote, and every enquiry
records the figure that was shown so nobody is surprised later.

## 3. Prices — deliberately unset

Every service has a "What it costs" block. The starting price is blank, so the
page says you quote after a site visit and lists what moves the number. Setting a
figure at **/admin/services → (service) → Pricing** switches the block to
"From ₹X". Leave it blank rather than publishing a number you would not honour.

## 4. Photographs — placeholders only

Eight generated placeholder images ship with the seed, attached to the sample
projects. They are deliberately not stock photographs of weddings: each is a
gradient in the brand palette with the word PLACEHOLDER across it, so anything
left unreplaced is obvious rather than passing as real work. They are flagged
`isPlaceholder`, which puts a badge on every card that uses one and a notice on
the project page.

Upload real photographs at **/admin/media**, then attach them per project at
**/admin/projects → (project) → Photographs**. Delete the placeholders once
nothing references them — the media library refuses to delete anything still in
use and tells you how many projects hold it.

To regenerate the placeholders: `node scripts/generate-placeholders.mjs`.

## 5. Sample projects — delete before launch

The seed creates six sample projects so the admin tables, filters and relation
pickers are not empty. They are `DRAFT` and titled "Sample — …", so they cannot
reach the public site, but they should be deleted or replaced once real events
are added. With none published, the portfolio shows an honest empty state rather
than invented work.

## 5a. Unbuilt routes

`lib/routes.ts` lists which public routes exist. Links to anything else still
render — the information architecture is complete in the nav and footer — but
they do not prefetch, so a page load does not fire failing requests for pages
that have not shipped. **Add a route to that file in the same commit that builds
it**, or its links will stay un-prefetched forever.

Every route linked from the nav or the footer now exists — the last two,
`/privacy-policy` and `/terms`, shipped with the smoke tests that found them
404ing. Anything added from here on lands on the branded 404 until its page
ships.

## 5b. Enquiry email

Enquiries are saved to the database first and emailed second, so a missing or
broken Resend configuration can never lose one — the family still sees a
confirmation and a reference number. Add `RESEND_API_KEY` to the environment and
at least one address under **Settings → Send enquiries to** to turn the emails
on; until then they are logged as skipped and everything else works.

`ENQUIRY_FROM_EMAIL` overrides the sender once the client has a verified domain
with Resend.

## 5c. Town pages — add your venue names

The twelve town pages under `/areas` carry copy written around what genuinely
differs between these places operationally — access for a loaded truck, open
ground versus a hall, how far the crew travels — plus the one or two things each
town is known for.

**They are shorter than the 500–800 words the brief asks for, on purpose.** The
missing length is venue names and event history, and inventing those would be
fabricating work you may not have done. Add real venues at
**/admin/areas → (town) → Venues we have set up at**. That is the strongest
local signal on the page and the one no competitor can copy — it is worth more
than another 300 words of general copy.

## 5d. Reviews and the "trusted by" list — empty on purpose

Nothing is seeded into testimonials or the trusted-by list. A made-up review is
worse than an empty page, and `aggregateRating` markup with no real reviews
behind it is the kind of thing that gets a site penalised — so none is emitted
until real reviews exist.

Add reviews at **/admin/testimonials** as they are given, and organisations at
**/admin/clients**. A review cannot be published without text (or a video URL),
so an empty one cannot slip through.

## 5e. The About page

The founder's story is deliberately a placeholder: it says so on the page rather
than carrying something written on the founder's behalf. The values, the way of
working and the service list are all real and derived from the brief. The stats
row stays hidden entirely until at least one figure is set — a row of `[TBD]`
markers says less than no row at all.

## 5f. The district map

CLAUDE.md asks for an interactive SVG map of the Surendranagar talukas. That
needs accurate boundary geometry, and an inaccurate map of a real district is
worse than none — so `/areas` uses a clear town list instead. Supply taluka
GeoJSON and the map can replace it without changing anything else.

## 5g. The eight guides

All eight blog posts ship written and published, in both languages, at
`/blog`. They are informational rather than promotional — what things cost and
why, how to choose between a hanger and a pandal, what to ask a contractor
before booking — because that is what brings people to the site from search.

The cost guide deliberately publishes **no figures**. It explains what moves the
number instead, which is consistent with the service pages and the quote form,
and it means the article does not go stale the moment prices change.

Edit them at **/admin/blog**. The editor only offers formatting the public page
can render, so nothing you write there can come out wrong on the site. Reading
time is calculated from the article rather than typed, so it cannot contradict
the length, and a post cannot be published with an empty body.

## 5h. The extra features — all off

**Settings › Extra features** holds five optional additions. Every one ships
switched off, and switching one off removes it completely: the code behind it
is not sent to the visitor's browser at all, so a feature you do not use costs
your visitors nothing. Turn one on, look at the site, turn it off again.

| Feature               | What it needs before it shows anything                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Muhurat countdown     | At least one date in the future, added on the same page. Once every date has passed the strip disappears rather than counting down to a date behind us.             |
| Mandap style explorer | Nothing — it is built from your service list. It appears at the bottom of the portfolio page.                                                                       |
| 360° viewer           | A project with a 360 photograph saved on it (**Projects › the project › 360° photograph**). Projects without one are unaffected.                                    |
| Instagram feed        | A Graph API token, pasted on the same page. Without one — or once it expires — the section shows your published project photographs instead, under its own heading. |
| Enquiry popup         | Nothing. It slides in after eight seconds, once per visit, and never on the quote or contact pages.                                                                 |

Two things worth knowing about the Instagram feed:

- **The token expires about every 60 days.** That is Instagram's rule, not a
  bug. When the feed goes quiet, generate a new long-lived token and paste it
  in. The old one is replaced; it is never shown back to you or to anyone else.
- The feed is not a substitute for the portfolio. It shows what you posted,
  not what you want shown — if the last twelve posts are not your best work,
  leave it off.

**A note on the countdown dates.** Nobody has filled them in: muhurat dates are
a real fact about a real calendar, and the wrong ones would be worse than none.
Ask whoever the family uses for the panchang and enter what they give you.

## 5i. What the popup costs you

The popup converts, and it also annoys people. It is off. If you turn it on,
watch the enquiry count for two weeks either side — if it does not move, turn
it off again. It is the one feature here that can make the site worse.

## 5j. The privacy policy and terms — read these

Both pages are written from what this website actually does, not from a
template: the real fields on the enquiry form, the three services it genuinely
talks to (host, email, images), and the one cookie it genuinely sets. Nothing in
either page describes a practice this site does not have.

They still need five minutes from somebody who knows the business — and, if the
business has a lawyer or a CA who handles this sort of thing, from them:

- **The terms say disputes go to the courts of Surendranagar, Gujarat, under
  Indian law.** That follows from where the business operates, but jurisdiction
  is a choice, not a fact. Confirm it.
- **The terms deliberately do not set out payment, cancellation or damage
  terms.** They say the binding terms are the ones written on your quote,
  because inventing a cancellation policy on your behalf would be exactly the
  kind of made-up business fact the rest of this document is about. If you want
  those terms on the website, write them and they will be added.
- **The privacy policy does not name the three services by brand.** It describes
  what each one does. Name them if you prefer; it reads more openly either way.
- **The contact block at the bottom of both pages reads from Settings**, so it
  can never drift from the footer — and shows `[TBD]` until the business details
  are filled in.

Both pages are indexed and listed in the sitemap on purpose. A visible privacy
policy is one of the trust signals a local business is judged on.

## 5k. Two admin modules that were not built

The original brief listed two modules that do not exist. They are not hidden
behind a flag and they are not half-finished — they were not built, and the
sidebar no longer advertises them, because a menu entry that goes nowhere is
worse than an honest gap.

**Bookings and the availability checker.** The idea was a calendar the client
marks up — available, limited, booked — feeding a "is my date free?" answer on
the public site. It is the largest single thing missing. It needs its own table,
an admin calendar, a public checker on the quote form, and a rule for what
happens when somebody enquires about a date already marked booked. Until it
exists, the quote form asks for the date and the client answers on the phone,
which is what the copy on the site says.

**Translations.** A `Translation` table exists in the schema, designed to let
the client override the interface wording — button labels, headings — without a
deploy. The admin screen for it was never built, so the table is unused and the
wording comes from `messages/en.json` and `messages/gu.json`. Building it means
reading overrides into next-intl's request config, which touches how every page
is cached; it is not a screen you add in an afternoon. **The content of the site
is fully editable without it** — this is only about the fixed interface words.

Neither gap blocks launch. Both are worth knowing about before somebody is
quoted for "small changes".

## 5l. Users, roles and the audit log

Built during the handover step, because a site that only one person can ever
sign in to is not really handed over.

- **Users & roles** (`/admin/users`, admins only). Each person gets their own
  account. Editors change the public site; admins can also add people and read
  the audit log. Passwords are generated and shown once — never stored in
  readable form, never sent back to the browser afterwards.
- **The audit log** (`/admin/audit`, admins only) was already being written on
  every save since the second build step; it just had nowhere to be read. It now
  reads in plain words — "Parth changed Service" — filtered by what was changed.

Two things cannot be done, on purpose: you cannot switch off or demote your own
account, and the last active admin cannot be switched off or demoted. Otherwise
the site could be left with nobody able to get back in.

## 6. Gujarati copy — read it through

All service copy, FAQs and UI strings are written in Gujarati, not machine
translated. It still deserves a read by a native speaker, particularly the
technical terms — some trade words (line array, delay tower, German hanger) are
deliberately left in English because that is what the trade calls them locally.

## Performance: where the numbers stand

Mobile Lighthouse, run against a production build (`pnpm build && pnpm start`,
then `pnpm lighthouse`):

|                | Score                                                             |
| -------------- | ----------------------------------------------------------------- |
| English pages  | 96–97 performance, 100 accessibility, 100 best practices, 100 SEO |
| Gujarati pages | 90 performance, 100 everything else                               |

The Gujarati gap is the font. Gujarati glyph coverage is about 141 KB however
it is sliced, and there is no smaller honest option through `next/font`. What
was done: the design originally paired two Gujarati families (Mukta Vaani for
headings, Noto for body) at 343 KB across eight files; that is now one variable
family at 201 KB across four. **If Gujarati mobile speed matters more than the
typography, dropping the webfont for the system Gujarati font would close the
gap entirely** — most Indian devices have one. That is a call for the client,
not a technical one.

The extra features do not change these numbers while they are off. That was
measured, not assumed: a build with the five features wired in but every flag
off downloads the same bytes as a build with them stripped out entirely, and
`pnpm verify:features` fails if the popup, the style explorer or the 360 viewer
ever turns up in a chunk the browser fetches.

Two other things worth knowing:

- The display font is deliberately **not preloaded**. With `display: swap` the
  headline paints immediately in a size-adjusted fallback; preloading the real
  face only put it ahead of the HTML on a slow connection and cost 500 ms of
  LCP.
- Lighthouse scores move by 3–4 points run to run on the same page. `pnpm
lighthouse` launches a fresh browser per page for that reason — reusing one
  made every audit after the first score lower and looked like a regression.

## Operational note: seeding and the build cache

`unstable_cache` entries persist in `.next/cache`. Running `pnpm db:seed` changes
the database without invalidating them, so a build straight after a seed can
serve stale content. Run `rm -rf .next` before rebuilding after a seed. Admin
edits do not have this problem — they call `revalidateTag` and `revalidatePath`.
