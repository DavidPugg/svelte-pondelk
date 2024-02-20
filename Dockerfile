# Stage 1
FROM node:18 as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2
FROM node:alpine as runner

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --only=production

COPY --from=builder /app/build ./build

EXPOSE ${PORT}

CMD ["node",  "build/index.js"]
