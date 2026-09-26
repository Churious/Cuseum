FROM node:22-bookworm-slim AS base

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib

RUN npm install -g auth@1.7.6 \
  && mkdir -p /app/data /home/cuseum \
  && groupadd --system --gid 1001 cuseum \
  && useradd --system --uid 1001 --gid cuseum --home-dir /home/cuseum cuseum \
  && chown -R cuseum:cuseum /app /home/cuseum

USER cuseum
ENV HOME=/home/cuseum

EXPOSE 3000

CMD ["sh", "-c", "auth migrate -y && npm run start"]
