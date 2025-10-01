FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# nginx คือเว็บเซิร์ฟเวอร์ที่ใช้ในการให้บริการไฟล์ที่ถูกสร้างขึ้น
# alpine คือเวอร์ชันที่มีขนาดเล็กของ nginx
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]