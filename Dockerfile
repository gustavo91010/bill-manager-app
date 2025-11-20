# --- Build ---
FROM node:18-alpine AS builder
WORKDIR /app

# Copia apenas package.json e package-lock.json primeiro para cache
COPY package*.json ./

# Instala dependências usando npm
RUN npm install --legacy-peer-deps

# Copia o restante do projeto
COPY . .

# Build do Next.js
RUN npm run build

# --- Runtime ---
FROM node:18-alpine
WORKDIR /app

# Copia build e dependências de runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Instala apenas dependências de produção
RUN npm install --production --legacy-peer-deps

EXPOSE 3000
CMD ["npm", "start"]
