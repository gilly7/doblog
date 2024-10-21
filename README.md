# DoBlog

A simple blogging app

This app is a nextjs frontend with a honojs backend.

## Feature set

- Similar to real world [app feature set](https://www.realworld.how/implementation-creation/features/)
- Can register, login and manage users
- Home page has list of articles (paginated)
- Optionally list my articles (from me or favourites)
- While logged in I can comment or favourite on an article

## Bootstrapping the app

Frontend: frontend
Backend: backend

Set up the right version of node and npm

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

Frontend

```sh
npx create-next-app@latest
```

Run

```sh
npm run dev
```

Backend

```sh
npm create hono@latest
```

Run

```sh
npm run dev
```

## Deployment

- This will be deployed in a containerized environment. be it docker based or kubernetes based set up
