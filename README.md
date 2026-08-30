# Regen Longevity Lab

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Regional websites

Each market has its own home page and product URLs. The header and footer region
buttons change market without leaving the current product. New visitors to `/`
see a region chooser; return visits use the saved `regen-region` preference.
A direct regional URL always takes precedence over a saved preference.

On a first visit to `/`, the site can suggest a region from the connection's
approximate country using Vercel's
[`x-vercel-ip-country` header](https://vercel.com/docs/headers/request-headers#x-vercel-ip-country).
The visitor must accept the suggestion before navigating; the site never
automatically changes region based on detected country. Dismissing it hides the
suggestion for the browser session while leaving all seven choices available.
Only an explicit regional visit/selection is saved as the region preference.

Detection is country-level only: this feature does not request GPS permission,
store raw IP addresses, or call an external IP lookup service. EU member countries
map to the EU storefront; the UK is separate. Unsupported/unknown countries,
localhost, and hosting without Vercel country headers show the ordinary chooser.
VPNs can affect the suggested country. `lib/region-detection.ts` contains the
mapping and detection guards; the root page is rendered per request, not cached
as one visitor's personalized suggestion for everyone.

| Region | Home | Language | Currency |
| --- | --- | --- | --- |
| Australia | `/au` | English | AUD |
| European Union | `/eu` | English | EUR |
| United States | `/us` | English | USD |
| United Kingdom | `/uk` | English | GBP |
| Singapore | `/sg` | English | SGD |
| Malaysia | `/my` | Bahasa Melayu | MYR |
| Indonesia | `/id` | Bahasa Indonesia | IDR |

For example, `/my/product/retatrutide` shows the Malay product page with MYR
settings. Original `/product/[slug]` links redirect to the saved region, with the
previous EUR storefront as the fallback. Unlisted `/verify` QR-code URLs and
lab-document endpoints are unchanged.

Region definitions live in `lib/regions.ts`. English, Malay and Indonesian copy
lives in `lib/home-copy.ts`, `lib/product-copy.ts` and `lib/support-copy.ts`.
The validated URL also sets the server-rendered HTML language through the
[Next.js request-header API](https://nextjs.org/docs/app/api-reference/file-conventions/proxy).
Set `NEXT_PUBLIC_SITE_URL` to the public production origin for canonical links;
otherwise the Vercel production URL is used, or localhost during local development.

### Prices and catalog assets

`lib/region-pricing.ts` is the single source for approved local prices. Existing
EUR prices (143 / 200) and documented IDR prices (2,500,000 / 3,500,000) are
preserved for cartridge / pen. AUD, USD, GBP, SGD and MYR currently show a
localized pricing inquiry, not a guessed conversion. Replace a market's `null`
values with its approved numeric price list to display local amounts.

Changing region does not assert local product approval or guaranteed shipping.
The team confirms availability, shipping and final pricing. The existing catalog
photos remain temporary assets until Regen product photography is supplied.

### Verification

With Node.js 24 and dependencies installed:

```bash
npm run test:regions
npx tsc --noEmit --incremental false
npm run build
```

The tests cover all seven region/language/currency mappings, regional URL
construction, product-preserving switches, invalid IDs, localized catalog data,
and the distinction between approved prices and regional pricing inquiries.
Country-detection and entry tests also cover all 27 EU members, unsupported
countries, saved-choice priority, and the dismissal/hosting guards. Component
tests cover all seven suggestion links, explicit acceptance, session-only
dismissal, keyboard focus and uniform region-card sizing.

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_2etLWhwVkjtaWGv6qMSCs3fyDb7L)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
