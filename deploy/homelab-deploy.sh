#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f deploy/k8s/secret.yaml ]]; then
  echo "Missing deploy/k8s/secret.yaml"
  exit 1
fi

echo "==> Building image"
docker build -t cuseum:latest .

echo "==> Importing image into k3s"
docker save cuseum:latest | sudo k3s ctr images import -

echo "==> Applying manifests"
kubectl apply -f deploy/k8s/namespace.yaml
kubectl apply -f deploy/k8s/pvc.yaml
if grep -q "REPLACE_ME" deploy/k8s/secret.yaml 2>/dev/null; then
  echo "==> Skipping secret.yaml (placeholders — keeping existing cluster secret)"
else
  kubectl apply -f deploy/k8s/secret.yaml
fi
kubectl apply -f deploy/k8s/deployment.yaml
kubectl apply -f deploy/k8s/service.yaml
kubectl apply -f deploy/k8s/ingress.yaml

echo "==> Restarting deployment (image tag is always :latest)"
kubectl rollout restart deployment/cuseum -n cuseum

echo "==> Waiting for rollout"
kubectl rollout status deployment/cuseum -n cuseum --timeout=180s

echo
echo "Cuseum is up:"
echo "  http://cuseum.192.168.1.143.nip.io"
echo "  Setup: /api/admin/setup/authorize?secret=YOUR_CURATOR_SETUP_SECRET"
