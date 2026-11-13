#!/bin/sh
set -eu
cd /workspace
git config --global --add safe.directory /workspace
if [ "${1:-}" = "--check" ]; then
  shift
  exec "$@"
fi
pnpm install --frozen-lockfile
exec opencode --standalone .
