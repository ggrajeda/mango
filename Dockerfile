# Dockerfile for containerizing the Next.js application
# Use official Node.js image as the base for building the application.
FROM node:20-alpine AS builder
WORKDIR /app

# Enable Corepack and install pnpm for package management.
RUN corepack enable && corepack prepare pnpm@latest --activate
# Copy dependency definitions.
COPY package.json pnpm-lock.yaml ./
# Install dependencies.
RUN pnpm install --frozen-lockfile
# Copy the rest of the application code.
COPY . .
# Build the Next.js application.
RUN --mount=type=secret,id=env_local,dst=/.env.local \
    export $(cat /.env.local | xargs) && \
    pnpm build
# Prune devDependencies to reduce image size.
RUN pnpm prune --prod

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prompts ./prompts

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
