# Kubernetes manifests — ArtisanMarket client

```sh
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## No Secret here, and none needed

Unlike the API, this workload takes no Secret at all. Every `VITE_*` value is
inlined into the public bundle at build time and is world-readable by anyone who
opens the site (threat T3 in `docs/threat-model.md`). There is nothing to inject
at runtime and nothing that would be protected by injecting it.

Build-time values are passed as `--build-arg` to `docker build`, and only
publishable ones belong there:

```sh
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  --build-arg VITE_SOCKET_URL=wss://api.example.com \
  --build-arg VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... \
  --build-arg VITE_IMAGEKIT_PUBLIC_KEY=public_... \
  --build-arg VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/... \
  -t artisanmarket-client:0.1.0 .
```

A **secret** key placed in a `VITE_*` variable would be published to every
visitor. The Code-stage ESLint ruleset blocks secret-looking `VITE_*` reads for
exactly that reason.

## Where the security headers live

The response-header policy (CSP, `X-Frame-Options`, `X-Content-Type-Options`,
Referrer and Permissions policy) is in `nginx.conf`, baked into the image — it
is the static host's responsibility, not the bundle's. This is threat **T5**.

Note the asymmetry this creates with the DAST evidence: the Staging gate scans
`vite preview`, which serves no headers, so those ZAP rules are scoped out in
`.zap/rules.tsv`. The headers are therefore **configured here but not exercised
by the current DAST gate**. Pointing the DAST stage at a container built from
this image, rather than at `vite preview`, would close that gap and is recorded
as follow-up work rather than claimed as done.

## Hardening applied

Scanned by Checkov in the Build stage. The namespace enforces the `restricted`
Pod Security Standard.

| Control | Setting |
|---|---|
| Non-root | `runAsNonRoot: true`, `runAsUser: 101` (the `nginx` user in the image) |
| Privilege escalation | `allowPrivilegeEscalation: false`, `privileged: false` |
| Filesystem | `readOnlyRootFilesystem: true`, with `emptyDir` mounts for nginx's cache and pid paths |
| Capabilities | `drop: [ALL]` — note this includes `NET_BIND_SERVICE`, which is why the container listens on 8080 rather than 80 |
| Syscalls | `seccompProfile: RuntimeDefault` |
| Resources | explicit CPU, memory and ephemeral-storage requests **and** limits |
| API credential | `automountServiceAccountToken: false` |
| Image | pinned tag, never `:latest`; `imagePullPolicy: Always` |
| Probes | readiness and liveness on `/` |

## Deliberate non-hardening

Dropping `ALL` capabilities means the container cannot bind a privileged port,
so nginx listens on 8080 and the Service maps 80 to it. Keeping port 80 inside
the container would have required either root or `NET_BIND_SERVICE`, both worse
than remapping the port.
