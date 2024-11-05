# DoBlog

A simple blogging app

This app is a nextjs frontend with a honojs backend.

## Feature set

- Similar to real world [app feature set](https://www.realworld.how/implementation-creation/features/)
- Can register, login and manage users
- Home page has list of articles (paginated)
- Optionally list my articles (from me or favourites)
- While logged in I can comment or favourite on an article

## Scope diagram

this diagram depicts initial project entities

![project scope](./docs/doblog-features.svg)

## Bootstrapping the app

Set up the right version of node and npm. Use [nvm](https://github.com/nvm-sh/nvm) for uniformity

```sh
nvm install v22.10.0 && nvm use v22.10.0
```

Confirm

```sh
$ node -v

v22.10.0

$ npm -v

10.9.0
```

Creating the app

```sh
npx create-next-app@latest
```

## Running the app

To run the app locally:

Ensure you have the dependencies installed

```sh
npm i
```

Then run the dev server

```sh
npm run dev
```

## Frontend

The frontend service is running in [port 7070](http://localhost:7070).

Create a `.env.local` file in the frontend folder with content similar to this:

```sh
ENV=dev
API_URL=http://localhost:7069
AUTH_URL=http://localhost:7070/api/auth
AUTH_SECRET=xxx # openssl rand -hex 32
```

## Backend

The rest API is running on [port 7069](http://localhost:7069)

create a `.env` file in the backend folder with content similar to this:

```sh
DATABASE_URL="postgresql://dublog:dublog@localhost:5432/dublog?schema=public"
JWT_SECRET="xxxx" # openssl rand -hex 32
```

For db management, prisma is used.

```sh
npx prisma init

npx prisma migrate dev --name init
```

### Database

The backend stores data in a postgres database. Checkout the [prisma schema](./backend/prisma/schema.prisma) for the db schema.

We use [docker compose](./compose.yml) for easily managing postgres.

```sh
docker compose up -d
```

Or use the Makefile command

```sh
make up
```

Inspect

```sh
$ make ps

docker compose ps
NAME                IMAGE                COMMAND                  SERVICE    CREATED       STATUS       PORTS
doblog-postgres-1   postgres:17-alpine   "docker-entrypoint.s…"   postgres   3 hours ago   Up 3 hours   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp
```

### Testing and working with the API

Checkout the [client.http](./client.http) file for http requests and their parameters. This works with [vscode rest client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).

## Deployment

- This will be deployed in a containerized environment. be it docker based or kubernetes based set up
