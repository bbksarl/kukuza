FROM node:24-alpine

ARG BUILD_DATE
ARG VCS_REF

LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.revision=$VCS_REF \
      org.opencontainers.image.source="https://github.com/bbksarl/kukuza" \
      org.opencontainers.image.title="kukuza-frontend" \
      org.opencontainers.image.description="KUKUZA Angular SSR application"

WORKDIR /app
ENV NODE_ENV=production \
    PORT=80 \
    KUKUZA_API_UPSTREAM=http://host.docker.internal:7200

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY .ci-builds/ ./dist/

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://127.0.0.1/healthz >/dev/null || exit 1

CMD ["node", "dist/server/server.mjs"]
