FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production: serve with nginx
FROM nginx:alpine

# Custom nginx config for SPA routing
COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # API proxy \
    location /api { \
        proxy_pass http://jarvis-backend:4000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
    \
    location /health { \
        proxy_pass http://jarvis-backend:4000; \
        proxy_set_header Host $host; \
    } \
    \
    location /api-docs { \
        proxy_pass http://jarvis-backend:4000; \
        proxy_set_header Host $host; \
    } \
    \
    # SPA fallback \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
