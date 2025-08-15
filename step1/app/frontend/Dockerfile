# -------- Build stage --------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
COPY public ./public
COPY build.js ./build.js
RUN npm run build &&     mkdir -p /out &&     cp -r public /out &&     mkdir -p /out/public/assets &&     cp -r dist/assets /out/public/

# -------- Runtime stage (Nginx) --------
FROM nginx:1.27-alpine
COPY --from=build /out/public /usr/share/nginx/html
# Basic security headers and caching can be added in default.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
