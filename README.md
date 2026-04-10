# Fullstack Pizzeria App

Fullstack portfolio project built around a pizzeria ordering flow with a public menu, cart and checkout experience, authentication, and an admin dashboard for content management.

## Links

- Live Demo: https://fullstack-pizzeria-app.vercel.app
- GitHub: https://github.com/G3rzson/fullstack_pizzeria_app

## About The Project

This project was built to demonstrate practical fullstack development in a single codebase. It covers both customer-facing and admin-facing workflows, including data management, authentication, file uploads, relational modeling, testing, and production deployment.

The application includes:

- public menu pages for pizzas, pastas, and drinks
- cart and checkout flow with saved address support
- authentication with login, register, logout, token refresh, and current-user handling
- admin dashboard for managing menu items, images, and users
- production deployment with Prisma migrations and cloud-hosted infrastructure

## Main Features

- Public menu pages for pizzas, pastas, and drinks
- Cart and checkout flow with saved address support
- User authentication with register, login, logout, refresh, and current-user endpoints
- Admin dashboard for CRUD operations on menu items and users
- Image upload flow with Cloudinary integration
- Prisma + MySQL data layer with migrations
- Automated tests for actions, components, auth, cart, utilities, and validation logic

## Engineering Highlights

- Built with Next.js App Router using both server and client components depending on the responsibility of the feature
- Implemented authentication flow with JWT-based access and refresh handling
- Modeled relational data in Prisma, including cascade behavior between users and saved addresses
- Integrated Cloudinary-based image upload and replacement flow for menu items
- Solved production cache issues on Vercel by moving affected routes to dynamic rendering where immediate data freshness was required
- Added broad automated test coverage with Vitest and Testing Library across UI, actions, auth, storage, and utility layers

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma ORM
- MySQL
- Tailwind CSS
- Shadcn/UI
- Vitest + Testing Library
- Cloudinary
- Vercel + Railway

## What I Practiced

- Designing and shipping fullstack CRUD features end to end
- Working with server actions, validation, database access, and UI state together
- Debugging real production issues such as caching and migration conflicts
- Structuring code for maintainability with tests around key business logic

## Local Setup

```bash
npm install
npm run db:generate
npm run dev
```

For schema changes in development:

```bash
npx prisma migrate dev --name your_migration_name
```

For production deployments:

```bash
npm run build
```

The production build runs Prisma migrations before the Next.js build step.

## License

This project was created for learning and portfolio purposes.

## Creator

- G3rzson
- GitHub: https://github.com/G3rzson
