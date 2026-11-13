FROM node:22-bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates git \
    && rm -rf /var/lib/apt/lists/*
RUN npm install --global @opencode/cli@2.1.4 pnpm@11.24.0
COPY git-askpass.sh /usr/local/bin/hermes-git-askpass
COPY entrypoint.sh /usr/local/bin/hermes-opencode-entrypoint
RUN chmod 755 /usr/local/bin/hermes-git-askpass /usr/local/bin/hermes-opencode-entrypoint
ENV HOME=/home/node \
    XDG_CACHE_HOME=/home/node/.cache \
    XDG_DATA_HOME=/home/node/.local/share \
    XDG_STATE_HOME=/home/node/.local/state \
    npm_config_cache=/home/node/.npm \
    GIT_ASKPASS=/usr/local/bin/hermes-git-askpass \
    GIT_TERMINAL_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /workspace
USER node
ENTRYPOINT ["/usr/local/bin/hermes-opencode-entrypoint"]
