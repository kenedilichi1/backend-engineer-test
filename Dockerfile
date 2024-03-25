FROM node:16.15.1

WORKDIR /app

COPY package.json ./

COPY pnpm-lock.yaml ./

COPY tsconfig.json ./

RUN rm -rf build

RUN npm install -g pnpm

RUN pnpm install

COPY src ./src

EXPOSE 3000

CMD ["pnpm","run","start:dev"]