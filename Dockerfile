#-----------step one----------------
FROM node:18 As builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#-----------step two ----------------

FROM node:18 As production

WORKDIR /app

COPY --from=builder /app/dist ./
COPY package*.json ./
RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "dist/main.js"]