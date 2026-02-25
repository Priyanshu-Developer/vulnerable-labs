FROM node:20-slim AS builder
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm  install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000

FROM node:20-slim
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/app ./app
COPY  --from=builder /app/utils/initdb.js ./initdb.js
COPY ./entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
