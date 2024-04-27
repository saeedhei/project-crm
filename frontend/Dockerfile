FROM node:20.9.0-alpine3.18 AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
# COPY . .
COPY ./ .
RUN npm run build


FROM nginx:stable-alpine AS runtime
COPY ./nginx/default.conf /etc/nginx/conf.d
# COPY --from=builder /app/dist /usr/share/nginx/html
RUN mkdir /app 
COPY --from=builder /app/dist /app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# docker build -t crm-frontend .
# docker network create neto
# docker run --name front-container --network=neto -d -p 8080:80 crm-frontend