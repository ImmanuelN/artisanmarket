# ArtisanMarket client — production image
#
# Build stage runs the project's own `npm run build` (vite build) so the image
# uses the same build path as CI and local development, not a reinvented one.
# The serve stage is nginx-alpine carrying only the static output — no Node, no
# node_modules, no build toolchain.
#
# On VITE_* build arguments: every import.meta.env.VITE_* value is inlined into
# the public bundle by design (threat T3 in docs/threat-model.md). Only
# publishable values belong here. They are declared as ARG, not ENV, so they do
# not persist into the runtime image environment, and none has a default — an
# unset one inlines as undefined rather than a misleading placeholder.

# ---------- build ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_SOCKET_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_IMAGEKIT_PUBLIC_KEY
ARG VITE_IMAGEKIT_URL_ENDPOINT

# `npm run build` is `vite build`; output goes to dist/ (vite default, not
# overridden in vite.config.ts).
RUN npm run build

# ---------- serve ----------
FROM nginx:1.27-alpine AS runtime

# nginx:alpine ships an unprivileged `nginx` user (uid/gid 101). Run as that
# user rather than root, which means binding an unprivileged port: 8080, not 80.
# k8s/service.yaml maps this.
ENV NGINX_PORT=8080

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Writable paths nginx needs when the root filesystem is mounted read-only
# (k8s/deployment.yaml sets readOnlyRootFilesystem with emptyDir mounts here).
RUN mkdir -p /var/cache/nginx /var/run \
    && chown -R nginx:nginx /var/cache/nginx /var/run /usr/share/nginx/html \
    # The default config ships a pid directive pointing at a root-owned path.
    && sed -i 's@^pid .*;@pid /var/run/nginx.pid;@' /etc/nginx/nginx.conf

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
