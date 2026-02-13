
FROM node:24-slim as builder 
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY  package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build 


# ─── Stage 2: Production ───────────────────────────────────────

FROM node:24-slim  as runner 
RUN corepack enable && corepack prepare pnpm@latest --activate

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh
COPY --from=builder /app/.next/ ./.next
COPY --from=builder /app/public/ ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/src/lib/initlize-db.js ./initlize-db.js



# Install only prod dependencies

RUN pnpm i --prod --frozen-lockfile+
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]

