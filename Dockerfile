FROM nginx:alpine

# Build arguments
ARG BUILD_DATE
ARG VCS_REF

# Labels
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url="https://gitlab.com/your-project" \
      org.label-schema.name="kukuza-frontend" \
      org.label-schema.description="Kukuza unified React application"

# The CI artifact is the single Vite dist directory (not one directory per app).
COPY .ci-builds/ /usr/share/nginx/html/

# Copy nginx configuration
ENV KUKUZA_API_UPSTREAM=http://host.docker.internal:7200
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx
ENV NGINX_ENVSUBST_FILTER=^KUKUZA_API_UPSTREAM$
COPY nginx.conf /etc/nginx/templates/nginx.conf.template

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost/ >/dev/null || exit 1
