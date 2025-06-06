# Build stage
FROM node:18-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci

# Copy source code
COPY . .

# Build ứng dụng - KHÔNG cần biến môi trường tại build time
ENV NODE_ENV=production
RUN npm run build

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

# Tạo cơ chế inject biến môi trường khi runtime
RUN apk add --no-cache bash
RUN echo '#!/bin/bash\n\
echo "window.ENV = {" > /usr/share/nginx/html/env-config.js\n\
echo "  VITE_APP_ROOT_API: \"$VITE_APP_ROOT_API\"," >> /usr/share/nginx/html/env-config.js\n\
echo "  VITE_APP_WEBSOCKET_URL: \"$VITE_APP_WEBSOCKET_URL\"" >> /usr/share/nginx/html/env-config.js\n\
echo "}" >> /usr/share/nginx/html/env-config.js\n\
nginx -g "daemon off;"\n\
' > /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
CMD ["/docker-entrypoint.sh"]