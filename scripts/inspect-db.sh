#!/usr/bin/env bash
set -euo pipefail
POD=$(kubectl get pod -n cuseum -l app=cuseum -o jsonpath='{.items[0].metadata.name}')
kubectl cp /tmp/inspect-db.mjs "cuseum/${POD}:/app/inspect-db.mjs"
kubectl exec -n cuseum deploy/cuseum -- sh -c 'cd /app && node inspect-db.mjs /app/data/cuseum.db'
