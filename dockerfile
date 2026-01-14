# ======= BASE IMAGE =======
FROM node:20-alpine

# ======= WORKDIR =======
WORKDIR /app

# ======= COPY CONFIG DULU =======
COPY package.json package-lock.json* ./

# ======= INSTALL DEPENDENCIES =======
RUN npm install

# ======= COPY SEMUA FILE =======
COPY . .

# ======= EXPOSE PORT =======
EXPOSE 3000

# ======= JALANKAN SERVER =======
CMD ["npm", "start"]
