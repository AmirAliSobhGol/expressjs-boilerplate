FROM node:14-alpine as builder

## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache python make g++

## Install build toolchain, install node deps and compile native add-ons
COPY package*.json ./
RUN npm ci --only=production

FROM node:14-alpine

RUN apk add --no-cache tini

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder node_modules ./node_modules
COPY . .

USER node

ENTRYPOINT ["tini", "--"]
CMD ["./bin/www.js"]

EXPOSE 3000
