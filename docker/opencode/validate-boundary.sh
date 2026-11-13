#!/bin/sh
set -eu
cd /workspace
test "$(git rev-parse --show-toplevel)" = /workspace
test ! -e /var/run/docker.sock
test ! -e /mnt/host
probe=/workspace/HERMESWEB-BOUNDARY-PROBE.txt
trap 'rm -f "$probe"' EXIT
printf 'inside\n' > "$probe"
test "$(cat "$probe")" = inside
if (touch /HERMESWEB-OUTSIDE-PROBE 2>/dev/null); then
  echo 'ERROR: root filesystem writable' >&2
  exit 1
fi
if (touch /workspace/../HERMESWEB-OUTSIDE-PROBE 2>/dev/null); then
  echo 'ERROR: parent writable' >&2
  exit 1
fi
test ! -e /HERMESWEB-OUTSIDE-PROBE
echo 'BOUNDARY_OK: repo writable; root and parent blocked; no Docker socket or host path'
