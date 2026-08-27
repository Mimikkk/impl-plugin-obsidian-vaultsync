FROM oven/bun:1.4-alpine
WORKDIR /app
COPY package.json bun.lock tsconfig.json ./
COPY apps/server/package.json apps/server/
COPY apps/plugin/package.json apps/plugin/
COPY libs/shared/package.json libs/shared/
COPY libs/framework/package.json libs/framework/
COPY libs/interaction/package.json libs/interaction/
RUN bun install --frozen-lockfile
COPY apps/server apps/server
COPY libs/shared libs/shared
COPY libs/framework libs/framework
COPY libs/interaction libs/interaction
ENV STORAGE_URL=/data
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=8080
EXPOSE 8080
VOLUME ["/data"]
WORKDIR /app/apps/server
CMD ["bun", "src/server.ts"]
