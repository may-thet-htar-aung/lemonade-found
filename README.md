# Lemonade Found

A lost-and-found platform with three products, all built from the
[Lemonade design system](https://lemonade-design-system.vercel.app)
(`@may_thet_htar_aung/lemonade-design-system`, pinned to 0.3.3).

| Product | Live | Folder | Screens |
|---|---|---|---|
| Public Website | [lemonade-found-public-website.vercel.app](https://lemonade-found-public-website.vercel.app) | `apps/website` | Landing, browse and search, item details, report form, claim submission, case tracking |
| Mobile App | [lemonade-found-mobile-app.vercel.app](https://lemonade-found-mobile-app.vercel.app) | `apps/mobile` | Home, report, search results, item details, ownership claim, recovery tracking, return confirmation |
| Back Office | [lemonade-found-back-office.vercel.app](https://lemonade-found-back-office.vercel.app) | `apps/back-office` | Dashboard, reports, match review, claims verification, users and venues, handover tracking |

`shared/data.ts` holds the mock data all three apps use, so case LF-2041 (the black leather wallet) runs through every product.

Each app is a Vite + React site that navigates with the URL hash (for example `#item/LF-2041`).

## Run locally

```bash
npm install
npm run dev:website       # http://localhost:5173
npm run dev:mobile
npm run dev:back-office
npm run build             # builds all three
```

## Deploy on Vercel

Create one Vercel project per app from this repo and set the **Root Directory**:

| Project | Root Directory |
|---|---|
| lemonade-found-website | `apps/website` |
| lemonade-found-mobile | `apps/mobile` |
| lemonade-found-back-office | `apps/back-office` |

Framework preset: Vite. Build command `npm run build`, output directory `dist`. Leave "Include source files outside of the Root Directory" on, because the apps import `shared/`.
