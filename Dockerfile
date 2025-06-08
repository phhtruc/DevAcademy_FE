FROM node:18 as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_APP_ROOT_API
ARG VITE_APP_WEBSOCKET_URL
ENV VITE_APP_ROOT_API=$VITE_APP_ROOT_API
ENV VITE_APP_WEBSOCKET_URL=$VITE_APP_WEBSOCKET_URL
RUN npm run build

FROM nginx:stable-alpine as production-stage
# Copy các file từ build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy config.js cho runtime environment
COPY config.js /usr/share/nginx/html/config.js

# Copy nginx config - chú ý vị trí đúng là conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cài đặt bash và copy script entrypoint
RUN apk add --no-cache bash
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Debug: xem thư mục html và cấu hình nginx
RUN ls -la /usr/share/nginx/html && cat /etc/nginx/conf.d/default.conf

# Port và entrypoint
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]