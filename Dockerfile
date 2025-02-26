FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g @expo/ngrok
RUN npm install
COPY . .

EXPOSE 8082

CMD ["npx", "expo", "start", "--tunnel"]
