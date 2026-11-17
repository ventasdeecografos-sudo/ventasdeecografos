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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Panel login

The **Panel** link opens `/panel`. Access requires a Supabase Auth email/password account and an email listed in `PANEL_ALLOWED_EMAILS`.

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from your Supabase project's API settings.
3. Set `SUPABASE_SERVICE_ROLE_KEY` to your project's service role key. Keep it server-only and never use a `NEXT_PUBLIC_` prefix.
4. Set `PANEL_ALLOWED_EMAILS` to the authorized email address or comma-separated addresses.
5. Create those users in Supabase Auth; the application does not provide public sign-up.
6. Apply the SQL migrations in `supabase/migrations/` in order in the Supabase SQL editor. The first creates the catalog table and imports the six existing ecógrafos; the second creates the public image bucket used for uploads from the panel; the third adds 16 catalog listings with illustrative images and technical details marked for confirmation; the fourth adds an optional, non-negative CLP price field; the fifth creates a private table for client quote requests; the sixth adds a private request token so each calculator change updates its existing quote.
7. Restart the development server after changing environment variables.

The panel verifies Supabase claims on the server and refreshes sessions using Next.js Proxy. Product changes are stored in Supabase and appear in the public home page, catalog, and product details. Public visitors can read products; only the server-side service role can write them, after the panel verifies the user's session and allowlisted email.

Product images can be entered as HTTP(S) URLs or uploaded from the panel. Uploads support JPG, PNG, WebP, and AVIF files up to 8 MB each; the gallery accepts multiple files at once (up to 20).

Product prices are optional, stored as whole CLP amounts, and managed in the add/edit panel. Leave the field blank when a product is quoted on request.

The public quote calculator first collects customer name, email, international phone and consent, then saves them with selected systems and the calculated estimate to `quote_requests` whenever a system is added or the selection changes. Server-side validation recalculates totals using current catalog prices. The table is private to the server's service-role client; direct access is denied to `anon` and `authenticated` roles. Contact details are checked for format only; ownership is not verified without email/SMS codes.

## Progressive web app

The public site can be installed from a supported browser when deployed over HTTPS. On Android, open the site in Chrome and choose **Install app** when the prompt appears, or use Chrome's menu and select **Install app** / **Add to Home screen**. On iPhone or iPad, open the site in Safari, tap **Share**, then **Add to Home Screen**.

The service worker caches only public static assets and an offline information page. It does not cache page HTML, Supabase/API requests, authentication data, or quote/contact details. The catalog, quote calculator, forms, and admin panel require an internet connection. If the connection returns while the app is open, use **Refresh** to safely reload current data without discarding an in-progress form automatically.

To test the service worker locally, build and start the production server (`npm run build && npm start`); service workers are intentionally not registered in Next.js development mode.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
