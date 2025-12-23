# =========================
# BUILD STAGE
# =========================
FROM node@sha256:658d0f63e501824d6c23e06d4bb95c71e7d704537c9d9272f488ac03a370d448 AS builder

WORKDIR /app

# Copia apenas os manifests para garantir cache eficiente
COPY package.json package-lock.json ./

# Validação defensiva do lockfile
RUN test -f package-lock.json || (echo "ERROR: package-lock.json is required" && exit 1)

# Instala dependências de forma reprodutível
RUN npm ci --omit=dev --no-audit --no-fund

# Copia o restante da aplicação
COPY . .

# =========================
# RUNTIME STAGE
# =========================
FROM gcr.io/distroless/nodejs20-debian12@sha256:7fff8fb4a6463da2765532290c958f7e6fc01d54d7539f0d2bda1e93c7636d7c

WORKDIR /app

# Copia apenas o necessário para execução
COPY --from=builder /app /app

# Executa como usuário não privilegiado
USER nonroot

# Comando explícito (sem shell)
CMD ["server.js"]
