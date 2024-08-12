# NodeJS
#FROM node:12.4.0-stretch AS nodejs-builder
FROM node:14.17-bullseye AS nodejs-builder

#ARG APP_BUILD_ENV="unknown"

RUN apt-get update && \
    apt-get install -y \
        apt-utils \
        apt-transport-https \
        lsb-release \
        ca-certificates \
        openssl \
        build-essential \
        curl

RUN mkdir -p /app
COPY ./examples /app/examples
COPY ./public /app/public
COPY ./src /app/src
COPY ./.babelrc \
     ./.browserslistrc \
     ./.env* \
     ./package.json \
     ./package-lock.json \
     ./webpack.common.js \
     ./webpack.prod.js \
     /app/
#RUN cd /app && npm install && npm run build:$APP_BUILD_ENV
RUN cd /app && npm install && npm run build

# Nginx
FROM nginx:1.22.1

ARG APP_VERSION_NAME="unknown"
ARG APP_VERSION_COMMIT="unknown"

RUN echo "Europe/Moscow" >/etc/timezone \
    && ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata \
    && rm /etc/nginx/conf.d/default.conf

COPY dockerfiles/nginx/nginx.conf /etc/nginx/nginx.conf
COPY dockerfiles/nginx/conf.d /etc/nginx/conf.d

RUN mkdir -p /var/www

COPY --from=nodejs-builder /app/build/ /var/www/

RUN echo "version:   $APP_VERSION_NAME" >> /var/www/version.txt
RUN echo "commit:    $APP_VERSION_COMMIT" >> /var/www/version.txt
RUN echo "built at:  $(date)" >> /var/www/version.txt

EXPOSE 80
