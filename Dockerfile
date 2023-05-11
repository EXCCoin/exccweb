FROM node:18-buster-slim as builder
RUN apt-get update -qq && apt-get install -y build-essential wget

RUN wget https://github.com/gohugoio/hugo/releases/download/v0.111.3/hugo_0.111.3_linux-amd64.deb -O hugo.deb && apt -y install ./hugo.deb

COPY . /site

WORKDIR /site

RUN npm install

RUN hugo --minify

FROM nginx:stable

RUN rm -rf /usr/share/nginx/html
COPY --from=builder /site/public /usr/share/nginx/html
COPY EXCC-Brandbook.pdf /usr/share/nginx/html/EXCC-Brandbook.pdf
COPY pgp.txt /usr/share/nginx/html/pgp.txt
RUN chown -R www-data:www-data /usr/share/nginx/html
