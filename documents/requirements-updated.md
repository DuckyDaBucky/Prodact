# Prodact Requirements (Updated to Match Current Project)

This requirements list reflects the implemented Prodact MVP in this repository. It scopes the project to the current Next.js internal tool, employee authentication, seeded Target product data, heuristic recommendations, protected app pages, and demo-ready dashboards.

| ID | Requirement | Description | Team Member |
| --- | --- | --- | --- |
| FR-1 | Employee login | The system shall allow users to log in with an employee ID and password through the `/login` page. | Hadent |
| FR-2 | Demo account creation | The system shall provide a hidden `/internal-signup` route for creating class-project demo employee accounts. | Hadent |
| FR-3 | Protected internal routes | The system shall prevent unauthenticated users from accessing protected internal pages under the app layout. | Hadent |
| FR-4 | Authenticated app shell | The system shall display a branded internal app shell with a sidebar, header, employee identity, and logout support after login. | Hadent |
| FR-5 | Dashboard overview | The system shall provide a `/dashboard` page summarizing the PA4 MVP services and linking to evidence routes. | Hadent |
| FR-6 | Navigation tabs | The system shall provide sidebar tabs for Dashboard, Store Performance, Inventory, Competitor Analysis, Product Analysis, Notifications, Messages, Store Layout, and Settings. | Hadent |
| FR-7 | Web scraper seed process | The system shall include a repeatable seed script that imports Target sample product data into the database. | Hadent |
| FR-8 | Seed process reporting | The seed script shall report processed, inserted, updated, skipped, and elapsed counts when product data is loaded. | Hadent |
| FR-9 | Database schema | The system shall define Drizzle-managed database tables for authentication, sessions, direct messages, Target products, and recommendation runs. | Hadent |
| FR-10 | Database migrations | The system shall provide committed Drizzle migrations that teammates can apply with the project migration command. | Hadent |
| FR-11 | Product picker | The Product Analysis page shall let users select a seeded Target product from a searchable product selector. | Simra |
| FR-12 | Product details | The Product Analysis page shall display the selected product title, category, image, rating, review count, seller, price, breadcrumbs, and description when available. | Simra |
| FR-13 | Product data completeness | The Product Analysis page shall calculate and display a completeness percentage based on populated seeded product fields. | Simra |
| FR-14 | Product discount signal | The Product Analysis page shall calculate and display a discount signal when initial and final prices show a markdown. | Simra |
| FR-15 | Currency handling | The Product Analysis page shall normalize seeded currency values such as `$` to a valid display currency before formatting prices. | Simra |
| FR-16 | Recommendation generation | The system shall generate related product recommendations for a selected product using Gemini-backed product insight when configured and local heuristic recommendations as fallback. | Simra |
| FR-17 | Recommendation scoring | The recommendation service shall rank products using category overlap, price proximity, rating quality, and dataset recommendation hints. | Simra |
| FR-18 | Recommendation reasons | The Product Analysis page shall display explainable reasons for each recommended product match. | Simra |
| FR-19 | Recommendation persistence | The system shall store recommendation run results in the database for traceability. | Simra |
| FR-20 | Recommendation API | The system shall expose recommendation results through `GET /api/recommendations/[productId]`. | Simra |
| FR-21 | Product Analysis fallback | The Product Analysis page shall show a setup state if seeded product data or recommendation data is unavailable. | Sangeetha |
| FR-22 | Invalid product fallback | The Product Analysis page shall recover from an invalid `productId` query by falling back to the first seeded product when possible. | Sangeetha |
| FR-23 | Store Performance page | The system shall provide a `/store-performance` tab showing store sales, customer count, refund/loss metrics, sales performance chart, and top products. | Sangeetha |
| FR-24 | Inventory page | The system shall provide an Inventory page showing product inventory, on-hand units, incoming stock, reorder need, price, reviews, sales history, and return rate using demo UI data. | Sangeetha |
| FR-25 | Competitor Analysis page | The system shall provide a Competitor Analysis page comparing Target and competitor pricing, stock, sales, sentiment, and AI-style decision support readouts. | Sangeetha |
| FR-26 | Competitor visualization | The Competitor Analysis page shall display visual comparisons using charts, scorecards, and competitor summary cards. | Sangeetha |
| FR-27 | Store Layout page | The system shall provide a Store Layout page for comparing current and recommended floor plan concepts. | Sangeetha |
| FR-28 | Notifications page | The system shall provide a Notifications page for product, restock, pricing, and social-style alert messaging. | Sangeetha |
| FR-29 | Messages page | The system shall provide a Messages page for reviewing faculty or internal conversations through the app shell. | Sangeetha |
| FR-30 | Settings page | The system shall provide a Settings page for configuring organization profile, coverage, AI behavior, notifications, privacy, and interface preferences. | Sangeetha |
| FR-31 | Direct message API | The system shall include API routes for reading messages and message users. | Hasnain |
| FR-32 | App route redirect | The root route shall redirect authenticated users to `/dashboard` and unauthenticated users to `/login`. | Hasnain |
| FR-33 | Session enforcement | The protected app layout shall require a valid session before rendering internal pages. | Hasnain |
| FR-34 | Demo-friendly placeholders | Pages without full backend integrations shall clearly present demo UI or placeholder content instead of claiming live enterprise integrations. | Hasnain |
| FR-35 | Build verification | The project shall support `npm run lint` and `npm run build` as verification commands for the implemented MVP. | Hasnain |
| FR-36 | Local development | The project shall run locally through the Next.js development server using the configured environment variables. | Hasnain |
| FR-37 | Environment configuration | The system shall read database and authentication configuration from local environment files such as `.env` or `.env.local`. | Hasnain |
| FR-38 | MVP service evidence | The project shall document the Web Scraper, Database, Authentication, and AI Recommendation service mappings in project documentation. | Hasnain |
| FR-39 | Implementation documentation | The project shall include documentation describing the actual implementation approach, technology stack, and verification steps. | Hasnain |
| FR-40 | Deployment documentation | The project shall include documentation describing the current demo deployment process, setup steps, route access, and known blockers. | Hasnain |
| FR-41 | Product search | The system shall provide a protected `/search` page for finding seeded Target products by title, category, or product ID. | Hasnain |
| FR-42 | Gemini product insight | The system shall process selected seeded product data with Gemini when `GEMINI_API_KEY` is configured and show a fallback insight when Gemini is unavailable. | Hasnain |
