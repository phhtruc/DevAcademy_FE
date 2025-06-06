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
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]