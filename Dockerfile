FROM node:18 as build-stage

WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
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
# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy config.js cho runtime environment
COPY config.js /usr/share/nginx/html/config.js

# Cài đặt bash và copy script entrypoint
RUN apk add --no-cache bash
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Port và entrypoint
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]