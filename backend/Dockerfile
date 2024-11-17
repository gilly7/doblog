FROM node:22-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY package*json tsconfig.json src prisma ./

RUN npm ci && \
    npm run build && \
    npx prisma generate && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN npm install prisma --global

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

COPY prisma .

USER hono
EXPOSE 7069

CMD ["node", "/app/dist/index.js"]
