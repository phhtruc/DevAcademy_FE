# Build stage
FROM node:16-bullseye AS build-stage

# Set working directory
WORKDIR /app

# Cài đặt các công cụ hỗ trợ debug
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Cài đặt dependencies với nhiều thông tin hơn
RUN npm ci --verbose

# Copy source code
COPY . .

# Hiển thị danh sách file
RUN ls -la

# Build ứng dụng với nhiều thông tin debug hơn
RUN npm run build --verbose || (echo "Build failed with error code $?" && cat npm-debug.log 2>/dev/null || true && exit 1)

# Production stage
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Tạo nginx config
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80