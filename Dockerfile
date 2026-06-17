FROM node:24-alpine

WORKDIR /app

RUN corepack enable && corepack prepare yarn@1 --activate

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY . .

RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
