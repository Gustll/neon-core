# Stage 1: Build the Angular app
FROM node:22-alpine as build
WORKDIR /app
COPY . ./
RUN npm install && npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/neon-core/browser /usr/share/nginx/html
