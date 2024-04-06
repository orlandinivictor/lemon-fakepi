FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile --link-duplicates

COPY . /app
RUN yarn build

FROM node:20-alpine AS production

ENV APP_PORT 3333
EXPOSE 3333


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .

CMD ["node", "dist/main.js"]
