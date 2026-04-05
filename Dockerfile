FROM nginx:alpine

# Build arguments
ARG BUILD_DATE
ARG VCS_REF

# Labels
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url="https://gitlab.com/your-project" \
      org.label-schema.name="kukuza-frontend" \
      org.label-schema.description="Kukuza Frontend Microfrontends"

# Copy built artifacts
COPY .ci-builds/ /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1