# Deployment Plan (Ideal Target State)

## Deployment Strategy

- Use a CI/CD-driven deployment pipeline with preview environments for every pull request and automatic production deployment from `main`.
- Keep releases small and frequent so schema, UI, and recommendation logic changes are easier to validate and roll back.
- Align deployment strategy with the app architecture by treating the web app, database migrations, and seed/evaluation jobs as coordinated release artifacts.

## Environment Setup

- Host the Next.js application on a managed platform such as Vercel.
- Use separate Neon branches or databases for development, staging, and production.
- Store secrets in managed environment settings instead of local files.
- Maintain separate dataset-loading and recommendation-generation tasks so operational jobs do not depend on manual laptop execution.

## Release Process

- Open a pull request from a feature branch.
- Run automated CI checks for linting, builds, type safety, and migration validity.
- Review the preview deployment with seeded representative data.
- Merge to `main` after approval.
- Apply production migrations in a controlled deployment step.
- Trigger any required seed refresh or recommendation backfill jobs after deployment.

## System Accessibility

- End users access the system through a hosted HTTPS URL on a project domain.
- Internal users authenticate through the standard login flow, ideally backed by SSO or managed employee identity.
- Role-based access controls limit which employees can view admin, reporting, or data-management routes.
- Preview deployments remain accessible to the team for testing, while production stays limited to approved users.
