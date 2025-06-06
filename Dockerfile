# Multi-stage build cho Vue.js với Vite
FROM node:18-alpine as build-stage

# Cài đặt git và python (cần thiết cho một số packages native)
RUN apk add --no-cache git python3 make g++

# Đặt working directory
WORKDIR /app

# Copy package files (hỗ trợ cả npm và yarn)
COPY package*.json ./
COPY yarn.lock* ./

# Cài đặt dependencies
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm ci; fi

# Copy source code
COPY . .

# Build ứng dụng với Vite
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy built app từ build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx config cho Vue.js SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]