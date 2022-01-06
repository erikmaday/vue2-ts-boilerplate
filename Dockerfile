FROM node:10.15.1 as build-stage
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
RUN mkdir /app
COPY --from=build-stage /app/dist /app/ci
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /app/
