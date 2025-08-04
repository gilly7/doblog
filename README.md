# 📝 DoBlog

**DoBlog** is a simple, full-stack blogging application featuring a **Next.js frontend** and a **Hono.js backend**. It aims to mimic real-world application behavior, inspired by the [RealWorld app spec](https://www.realworld.how/implementation-creation/features/).

---

## ✨ Features

- 🔐 User registration, login, and profile management
- 📝 Create, edit, and delete articles
- 🗂 Paginated article listing on the homepage
- 💾 View personal articles and favorited articles
- 💬 Comment on and favorite articles while logged in

---

## 📊 Scope Diagram

This diagram depicts the initial project entities and their relationships:

![Project Scope](./docs/doblog-features.svg)

---

## ⚙️ Bootstrapping the App

Ensure you have the correct version of Node.js and npm installed. Use [nvm](https://github.com/nvm-sh/nvm) for consistency:

```sh
nvm install v22.10.0 && nvm use v22.10.0
node -v   # v22.10.0
npm -v    # 10.9.0
npx create-next-app@latest
npm install
npm run dev
ENV=dev
API_URL=http://localhost:7069
AUTH_URL=http://localhost:7070/api/auth
AUTH_SECRET=your_auth_secret # openssl rand -hex 32
DATABASE_URL="postgresql://doblog:doblog@localhost:5432/doblog?schema=public"
JWT_SECRET=your_jwt_secret # openssl rand -hex 32
🗃 Database (PostgreSQL + Prisma)
We use Prisma as the ORM and PostgreSQL as the database.

Common Commands
Initialize Prisma:

npx prisma init

Run development migrations:

npx prisma migrate dev --name init
Deploy migrations to production:
npx prisma migrate deploy
Running Postgres with Docker
We use Docker Compose to run PostgreSQL:

docker compose up -d

Check the container status:
make ps
🔌 API Testing
You can test the API using the client.http file with the VSCode REST Client extension.

📦 Deployment
This project is containerized and deployed in a Kubernetes environment.

See deploying-the-app.md for detailed setup instructions.

