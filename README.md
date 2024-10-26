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

## Backend

The rest API is running on [/api](http://localhost:7069)

```sh
npx prisma init

npx prisma migrate dev --name init
```

## Deployment

- This will be deployed in a containerized environment. be it docker based or kubernetes based set up
