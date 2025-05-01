FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY src/ ./src/

# Use proper CMD syntax (remove brackets for npm commands)
CMD npm run dev