# Sociava

Sociava is a modern web platform for discovering and connecting with people who share your interests, primarily focused on Discord users. Built with Next.js, Prisma, and Tailwind CSS, it offers a beautiful, responsive UI and a rich set of features for both end-users and administrators.

## Features

- **User Profiles:** Create, edit, and showcase your Discord profile, including skills, roles, languages, and social links.
- **Explore:** Find users by sorting (newest, oldest, popular, random) and filter by language, roles, and skills.
- **Stats Dashboard:** View live statistics about users and entities on the platform.
- **Team Page:** Meet the staff and contributors behind Sociava.
- **Admin Panel:** Manage users and entities, including banning and verifying users (admin only).
- **Authentication:** Secure login via Discord OAuth using NextAuth.js.
- **Modern UI:** Built with Tailwind CSS, Framer Motion, and React Icons for a sleek, animated experience.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Prisma ORM** (PostgreSQL)
- **NextAuth.js** (Auth provider)
- **Tailwind CSS**
- **Framer Motion** (animations)
- **React Icons**
- **Zod**

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/sociava/website.git
   cd website
   ```
2. **Install dependencies:**
   ```sh
   bun install
   # or
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Discord and database credentials.
4. **Run database migrations:**
   ```sh
   bun run db:push
   # or
   npx prisma db push
   ```
5. **Start the development server:**
   ```sh
   bun run dev
   # or
   npm run dev
   ```
6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Scripts

- `dev` – Start the development server
- `build` – Build for production
- `start` – Start the production server
- `db:push` – Push Prisma schema to the database
- `db:studio` – Open Prisma Studio
- `lint` – Lint the codebase
- `format` – Format code with Prettier

## Folder Structure

- `app/` – Next.js app directory (routes, pages, API)
- `components/` – Reusable React components (UI, layouts, cards)
- `lib/` – Database and utility libraries
- `prisma/` – Prisma schema and migrations
- `types/` – TypeScript types

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

---

Made with ❤️ by team Purrquinox.
