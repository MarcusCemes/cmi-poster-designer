FROM node:24-alpine AS base

WORKDIR /app


FROM base AS build

RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY . /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm run build


FROM base as prod
ENV NODE_ENV=production
ENV ORIGIN=https://posters.mkus.dev
ENV BODY_SIZE_LIMIT=16M

RUN apk add --no-cache typst

COPY workspace /app/workspace
COPY --from=build /app/build /app

EXPOSE 3000
CMD ["node", "index.js"]
