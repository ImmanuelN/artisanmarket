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
# --ignore-scripts stops third-party lifecycle scripts executing at build time
# (docker:S6505). Verified locally that vite build still succeeds without them.
RUN npm ci --ignore-scripts

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
# Pinned to a current nginx/alpine. 1.27-alpine resolves to alpine 3.21.3, whose
# OS packages carried 40 Trivy findings (38 HIGH, 2 CRITICAL); 1.31.x tracks a
# current alpine. Pinned to a patch version rather than `alpine` or `1.31-alpine`
# so the image that gets scanned is the image that gets deployed.
FROM nginx:1.31.6-alpine AS runtime

# Run as a high UID (>10000) so the container user cannot collide with a real
# user on the host (CKV_K8S_40). The base image's `nginx` user is uid 101, well
# inside the range a host assigns to system accounts.
#
# libexpat is upgraded explicitly: the pinned base still carries 2.8.4-r0, which
# Trivy flags for CVE-2026-93990 (XML injection), fixed in 2.8.5-r0.
RUN apk add --no-cache --upgrade libexpat \
    && addgroup -g 10001 -S app \
    && adduser -u 10001 -S app -G app

# Running as non-root means nginx cannot bind a privileged port, so it listens
# on 8080; k8s/service.yaml maps 80 to it.
ENV NGINX_PORT=8080

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Served content stays owned by root and is only readable by the runtime user, so
# a compromised nginx process cannot rewrite the files it serves (docker:S6504).
COPY --from=build --chown=root:root /app/dist /usr/share/nginx/html

# Writable paths nginx needs when the root filesystem is mounted read-only
# (k8s/deployment.yaml sets readOnlyRootFilesystem with emptyDir mounts here).
# a+rX keeps directories traversable while leaving files non-writable.
RUN mkdir -p /var/cache/nginx /var/run \
    && chown -R 10001:10001 /var/cache/nginx /var/run \
    && chmod -R a-w,a+rX /usr/share/nginx/html \
    # The default config ships a pid directive pointing at a root-owned path.
    && sed -i 's@^pid .*;@pid /var/run/nginx.pid;@' /etc/nginx/nginx.conf \
    # The `user` directive only applies when the master starts as root; left in
    # place it emits a warning on every start.
    && sed -i '/^user  *nginx;/d' /etc/nginx/nginx.conf

USER 10001

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
