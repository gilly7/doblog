FROM node:22.10.0-alpine AS builder

WORKDIR /app

ARG ENV
ARG API_URL

ENV NEXT_PUBLIC_ENV=${ENV}
ENV NEXT_PUBLIC_API_URL=${API_URL}

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22.10.0-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
