# Stage 1
FROM node:18 

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build

EXPOSE ${PORT}

CMD ["node",  "build/index.js"]
