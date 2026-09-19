This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Article artwork and presentation

Posts live in `content/blog/`. Set `featuredimage` to a local `/img/...` path
and `featuredimagealt` to a description of the artwork. Store the asset in
`public/img/`; use an optimised JPEG or PNG so social preview crawlers can
read it. The cover appears automatically above the article, on home/archive/
topic/related cards, and in Open Graph and Twitter metadata. Do not repeat
the cover as the first Markdown image. Keep diagrams and other inline images
in the article body.

Shared cards use Next.js responsive image optimisation. Site typography uses
local system fonts, with no build-time font downloads. Entrance animations
are finite, scroll reveals run once, and the site's CSS and Framer Motion
respect `prefers-reduced-motion`.

## Credly badges

The About page renders a static snapshot of public Credly badges, ordered by
issue date (newest first), with local logos and links to credential verification.
Expiry dates are shown where provided, including for historical credentials.

To refresh the snapshot and logos, run `node scripts/import-credly.mjs`, then
commit `src/data/credly-badges.json` and `public/img/credly/` with the site.
Normal builds and page views do not require a Credly connection or login.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
