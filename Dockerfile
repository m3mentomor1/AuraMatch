FROM node:22-alpine

WORKDIR /app

# Install system dependencies if needed (good for bcrypt, multer sharp, etc)
RUN apk add --no-cache python3 make g++

# Copy dependency files first so Docker can cache them
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the app
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
