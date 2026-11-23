#!/bin/sh
set -eu

image=${1:?Usage: deploy-container.sh IMAGE TAG}
tag=${2:?Usage: deploy-container.sh IMAGE TAG}

case "$tag" in
  (''|*[!a-z0-9-]*) echo "Invalid image tag" >&2; exit 2 ;;
esac
case "$image" in
  (''|*[!a-zA-Z0-9._/:@-]*) echo "Invalid registry image name" >&2; exit 2 ;;
esac

name="kukuza-frontend-$tag"
backup="$name-previous"

docker pull "$image:$tag"
docker rm -f "$backup" >/dev/null 2>&1 || true
if docker inspect "$name" >/dev/null 2>&1; then
  docker rename "$name" "$backup"
  docker stop "$backup" >/dev/null
fi

rollback() {
  docker rm -f "$name" >/dev/null 2>&1 || true
  if docker inspect "$backup" >/dev/null 2>&1; then
    docker rename "$backup" "$name"
    docker start "$name" >/dev/null
  fi
}

if ! docker run -d \
  --name "$name" \
  --network kukuza-network \
  --add-host=host.docker.internal:host-gateway \
  --restart unless-stopped \
  -p 3000:80 \
  "$image:$tag"; then
  rollback
  exit 1
fi

health=""
attempt=0
while [ "$attempt" -lt 30 ]; do
  health="$(docker inspect --format '{{.State.Health.Status}}' "$name" 2>/dev/null || true)"
  [ "$health" = healthy ] && break
  [ "$health" = unhealthy ] && break
  attempt=$((attempt + 1))
  sleep 2
done

if [ "$health" != healthy ]; then
  rollback
  exit 1
fi

docker rm -f "$backup" >/dev/null 2>&1 || true
docker image prune -f
