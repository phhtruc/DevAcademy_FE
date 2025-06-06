# Multi-stage build cho Vue.js application
FROM node:18-alpine as build-stage

# Đặt working directory
WORKDIR /app

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy built app từ build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx config (tùy chọn)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]