# Use a lightweight Debian-based Node.js image
FROM node:20-slim

# Install compilers and tools
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    default-jdk \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production node modules
RUN npm install --omit=dev

# Copy all source files
COPY . .

# Ensure the temp directory exists
RUN mkdir -p public/temp

# Expose port 8000
EXPOSE 8000

# Set production environment flags
ENV PORT=8000
ENV NODE_ENV=production

# Start the server
CMD ["node", "src/server.js"]
