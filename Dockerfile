FROM node:24-alpine AS base

WORKDIR /app


FROM base AS pnpm

RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY package.json pnpm-lock.yaml /app


FROM pnpm AS build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . /app
RUN pnpm run build


FROM pnpm AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


FROM base AS prod
ENV NODE_ENV=production

RUN apk add --no-cache typst

COPY drizzle.config.ts /app
COPY drizzle /app/drizzle
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY templates /app/templates
COPY --from=build /app/build /app

ENV ORIGIN=https://poster-designer.mkus.dev
ENV BODY_SIZE_LIMIT=16M
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000
CMD ["node", "index.js"]
