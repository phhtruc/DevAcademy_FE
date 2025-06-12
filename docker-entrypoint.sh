#!/bin/bash

# Debug: Hiển thị các biến môi trường
echo "VITE_APP_ROOT_API: $VITE_APP_ROOT_API"
echo "VITE_APP_WEBSOCKET_URL: $VITE_APP_WEBSOCKET_URL"

# Kiểm tra file config.js
if [ -f /usr/share/nginx/html/config.js ]; then
    echo "Replacing environment variables in config.js..."
    sed -i "s|__VITE_APP_ROOT_API__|$VITE_APP_ROOT_API|g" /usr/share/nginx/html/config.js
    sed -i "s|__VITE_APP_WEBSOCKET_URL__|$VITE_APP_WEBSOCKET_URL|g" /usr/share/nginx/html/config.js
    echo "Config.js after replacement:"
    cat /usr/share/nginx/html/config.js
else
    echo "WARNING: config.js file not found!"
    ls -la /usr/share/nginx/html/
fi

# Kiểm tra cấu hình nginx
echo "Checking Nginx configuration..."
nginx -t

# Chạy nginx
echo "Starting Nginx..."
exec nginx -g 'daemon off;'