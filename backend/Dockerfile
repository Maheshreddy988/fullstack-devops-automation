FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# create the user (runs as root, so it must come before USER)
RUN addgroup -S app && adduser -S app -G app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=app:app . .

USER app
EXPOSE 5000

CMD ["node", "index.js"]