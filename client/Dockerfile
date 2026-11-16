# Etapa 1: Build de producción Vite + React
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .

ARG VITE_API_BASE_URL=/api
ARG VITE_SITE_NAME="LG Semillas — Limagrain Argentina"
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SITE_NAME=${VITE_SITE_NAME}

RUN npm run build

# Etapa 2: Nginx ligero sirviendo archivos estáticos y proxy /api
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

