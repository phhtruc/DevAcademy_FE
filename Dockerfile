# # Multi-stage build cho Vue.js với Vite - fix Rollup issue
# FROM node:18-alpine as build-stage

# # Cài đặt git và python (cần thiết cho một số packages native)
# RUN apk add --no-cache git python3 make g++

# # Đặt working directory
# WORKDIR /app

# # Copy package files
# COPY package*.json ./
# COPY yarn.lock* ./

# # Clean npm cache và cài đặt dependencies
# RUN npm cache clean --force && \
#     if [ -f yarn.lock ]; then \
#         yarn install --frozen-lockfile; \
#     else \
#         npm ci && \
#         # Fix Rollup native binary issue
#         rm -rf node_modules/@rollup/rollup-linux-x64-musl && \
#         npm install --no-save @rollup/rollup-linux-x64-musl; \
#     fi

# # Copy source code
# COPY . .

# # Build ứng dụng với Vite
# RUN npm run build

# # Production stage
# FROM nginx:stable-alpine as production-stage

# # Copy built app từ build stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html

# # Copy nginx config cho Vue.js SPA
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# build stage
# FROM node:16-alpine as build-stage
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build
# ## các bạn có thể dùng yarn install .... tuỳ nhu cầu nhé

# # production stage
# FROM nginx:1.17-alpine as production-stage
# # Expose port 80
# EXPOSE 80

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
# COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

    