# Install dependencies only when needed
FROM node:18-alpine3.15 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./  
RUN npm install  # Cambiamos yarn install por npm install

# Build the app with cache dependencies
FROM node:18-alpine3.15 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build  # Cambiamos yarn build por npm run build

# Production image, copy all the files and run next
FROM node:18-alpine3.15 AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json package-lock.json ./  

RUN npm install --only=prod  # Cambiamos yarn install --prod por npm install --only=prod

COPY --from=builder /app/dist ./dist

# Expose the port and run the application
EXPOSE 3000

CMD ["node", "dist/main"]
