# -------- Build stage --------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# -------- Runtime stage --------
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY server.js ./server.js
EXPOSE 3000
USER node
CMD ["node", "server.js"]
