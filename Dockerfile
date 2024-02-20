# Stage 1
FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE ${PORT}

CMD ["node",  "build/index.js"]
