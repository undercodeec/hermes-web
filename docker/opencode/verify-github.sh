#!/bin/sh
set -eu
cd /workspace
branch=${1:-dev/hermesweb-r2-auth-check}
case "$branch" in
  dev/*) ;;
  *) echo 'VALIDATION_BRANCH_MUST_START_WITH_dev/' >&2; exit 2 ;;
esac
git check-ref-format --branch "$branch" >/dev/null
test "$(git remote get-url origin)" = 'https://github.com/undercodeec/hermes-web.git'
node /workspace/docker/opencode/verify-github.mjs
git ls-remote --heads origin >/dev/null
if git ls-remote --exit-code --heads origin "refs/heads/$branch" >/dev/null; then
  echo 'DRY_RUN_TARGET_EXISTS: result may only report up-to-date state'
else
  echo 'DRY_RUN_TARGET_ABSENT: checking a proposed development branch'
fi
git -c credential.helper= push --dry-run --no-verify --porcelain origin "HEAD:refs/heads/$branch"
echo 'DRY_RUN_ONLY: no remote ref was updated'
