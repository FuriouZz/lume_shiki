FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-bullseye

ARG DENO_VERSION=1.39.0

ENV DENO_INSTALL=/deno
RUN mkdir -p /deno \
    && curl -fsSL https://deno.land/x/install/install.sh | sh -s v${DENO_VERSION} \
    && chown -R vscode /deno

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno
