#!/bin/bash
# Thay thế giá trị trong config.js
sed -i "s|__VITE_APP_ROOT_API__|$VITE_APP_ROOT_API|g" /usr/share/nginx/html/config.js
sed -i "s|__VITE_APP_WEBSOCKET_URL__|$VITE_APP_WEBSOCKET_URL|g" /usr/share/nginx/html/config.js

# Chạy nginx
exec nginx -g 'daemon off;'