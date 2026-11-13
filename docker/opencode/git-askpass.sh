#!/bin/sh
case "$1" in
  *Username*) printf '%s\n' 'x-access-token' ;;
  *Password*) test -n "${HERMES_GITHUB_TOKEN:-}" || exit 1; printf '%s\n' "$HERMES_GITHUB_TOKEN" ;;
  *) exit 1 ;;
esac
