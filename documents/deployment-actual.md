# Deployment Plan (Actual Codebase)

## Deployment Strategy

- The current repository is ready for a Vercel-hosted MVP demo.
- Releases are still lightweight demo releases: the team validates locally, pushes to `main`, and lets Vercel build the Next.js app from Git integration.
- `vercel.json` pins the deployment shape to `npm ci` and `npm run build`.

## Environment Setup

- The main development runtime is each developer's local machine.
- The production demo runtime is Vercel running the Next.js app.
- Data is backed by Neon Postgres using the configured `DATABASE_URL`.
- Environment values are stored locally in `.env.local` or `.env`, and in Vercel Project Settings for deployed previews and production.
- Required Vercel variables are `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `GEMINI_API_KEY`, and `GEMINI_MODEL`.

## Release Process

- Pull the latest code from the shared branch.
- Install dependencies with `npm install`.
- Apply schema changes with `npm run db:migrate`.
- Load the Target sample data through the Web Scraper Service with `npm run db:seed`.
- Confirm the seeded products and recommendations with `npm run db:verify`.
- Run verification with `npm run check`.
- Push to `main` so Vercel deploys the latest commit, or run `vercel pull --yes --environment=production`, `vercel build --prod`, and `vercel deploy --prebuilt --prod`.
- Demo `/dashboard`, `/login`, `/internal-signup`, `/search`, `/product-analysis`, `/inventory`, and `/alerts`.

## System Accessibility

- Users access the application through the Next.js web app, typically on `http://localhost:3000`.
- Deployed users access the Vercel production URL or custom domain.
- Login happens at `/login`.
- Demo account setup is available through `/internal-signup`.
- Protected feature pages, including the seeded Product Analysis route, are available only after authentication.

## PA4 MVP Verification

- Web Scraper Service:
  `npm run db:seed` downloads or imports the Target dataset, normalizes rows, and reports processed, inserted, updated, skipped, and elapsed counts.
- Database Service:
  `npm run db:migrate` applies the Drizzle schema, and the seeded `target_product` plus `recommendation_run` tables support the Product Analysis demo.
- Authentication Service:
  `/internal-signup` creates a demo employee account, `/login` authenticates with employee ID and password, and the protected app layout blocks unauthenticated access.
- AI Recommendation Service:
  `/search` and `/product-analysis` read seeded products, show Gemini-backed product insight when configured, render ranked recommendations with explainable reasons, and `GET /api/recommendations/[productId]?limit=5` returns recommendation JSON.
- Notification Service:
  `/alerts` generates product, restock, pricing, and data-quality notifications from seeded Target rows.
- Vercel Deployment:
  `npm run check` must pass locally, Vercel must have the required environment variables, and the deployed app must be smoke-tested through login, dashboard, Search, Product Analysis, and Gemini insight.

## Environment Blockers

- If Neon is unreachable from a local laptop, database migration and seed verification should be rerun from a machine or network with valid `DATABASE_URL` access.
- The app can still be linted and built locally without mutating production data.
- If `GEMINI_API_KEY` is missing or rate-limited, the app shows fallback AI insight so the demo remains usable.
