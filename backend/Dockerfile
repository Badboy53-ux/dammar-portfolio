# Backend image for any container host (Railway, Fly.io, DigitalOcean App Platform,
# Google Cloud Run, a VPS, ...).
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install dependencies first so this layer is cached between builds.
COPY package*.json ./
RUN npm install --omit=dev

# Copy the application source.
COPY . .

EXPOSE 5000

# Uses /api/health so orchestrators can detect a healthy container.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-5000}/api/health" || exit 1

CMD ["npm", "start"]
