# Deployment Guide - دليل النشر

## نظرة عامة

دليل شامل لنشر منصة مُركَّز في بيئات مختلفة مع ضمان الأمان والأداء والموثوقية.

## متطلبات النظام

### الحد الأدنى

- **Node.js**: 18.x أو أحدث
- **MongoDB**: 5.0 أو أحدث
- **RAM**: 2GB
- **Storage**: 10GB
- **CPU**: 2 cores

### الموصى به

- **Node.js**: 20.x LTS
- **MongoDB**: 6.0 أو أحدث
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **CPU**: 4 cores

## متغيرات البيئة

### ملف `.env.local`

```env
# Database
MONGO_URL=mongodb://localhost:27017/articles-database

# Email Service
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Application
url=http://localhost:3000


# Security (Production)
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# Monitoring
MONITORING_ENABLED=true
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### ملف `.env.production`

```env
# Database
MONGO_URL=mongodb://username:password@host:port/database?authSource=admin

# Email Service
GMAIL_EMAIL=production-email@gmail.com
GMAIL_APP_PASSWORD=production-app-password

# Application
url=https://yourdomain.com


# Security
JWT_SECRET=super-secure-jwt-secret
ENCRYPTION_KEY=super-secure-encryption-key

# Monitoring
MONITORING_ENABLED=true
LOG_LEVEL=warn

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# CDN
CDN_URL=https://cdn.yourdomain.com
```

## النشر المحلي (Local Development)

### 1. إعداد البيئة

```bash
# استنساخ المشروع
git clone https://github.com/yourusername/articles-nextjs.git
cd articles-nextjs

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
# تعديل .env.local حسب الحاجة
```

### 2. إعداد قاعدة البيانات

```bash
# تشغيل MongoDB محلياً
mongod --dbpath /path/to/your/db

# أو استخدام Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# إنشاء قاعدة البيانات والمجموعات
mongo articles-database
```

### 3. تشغيل التطبيق

```bash
# وضع التطوير
npm run dev

# أو وضع الإنتاج
npm run build
npm start
```

## النشر على VPS

### 1. إعداد الخادم

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# تثبيت Nginx
sudo apt install nginx -y

# تثبيت PM2
sudo npm install -g pm2
```

### 2. إعداد قاعدة البيانات

```bash
# تشغيل MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# إنشاء مستخدم قاعدة البيانات
mongo
use admin
db.createUser({
  user: "articles_user",
  pwd: "secure_password",
  roles: [
    { role: "readWrite", db: "articles-database" }
  ]
})
```

### 3. نشر التطبيق

```bash
# إنشاء مجلد التطبيق
sudo mkdir -p /var/www/articles-nextjs
sudo chown -R $USER:$USER /var/www/articles-nextjs

# نسخ الملفات
cp -r . /var/www/articles-nextjs/
cd /var/www/articles-nextjs

# تثبيت التبعيات
npm install --production

# بناء التطبيق
npm run build

# إعداد PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. إعداد Nginx

```nginx
# /etc/nginx/sites-available/articles-nextjs
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### 5. إعداد SSL

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx -y

# الحصول على شهادة SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# تجديد تلقائي
sudo crontab -e
# إضافة: 0 12 * * * /usr/bin/certbot renew --quiet
```

## النشر على Docker

### 1. ملف Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app




RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. ملف docker-compose.yml

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"

    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongodb_data:
```

### 3. تشغيل Docker

```bash
# بناء وتشغيل الخدمات
docker-compose up -d

# عرض السجلات
docker-compose logs -f app

# إيقاف الخدمات
docker-compose down
```

## النشر على Cloud Platforms

### 1. Vercel (موصى به)

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel

# إعداد متغيرات البيئة
vercel env add MONGO_URL
vercel env add GMAIL_EMAIL
vercel env add GMAIL_APP_PASSWORD
```

### 2. Railway

```bash
# تثبيت Railway CLI
npm install -g @railway/cli

# تسجيل الدخول
railway login

# إنشاء مشروع جديد
railway init

# إضافة قاعدة البيانات
railway add mongodb

# نشر المشروع
railway up
```

### 3. DigitalOcean App Platform

```yaml
# .do/app.yaml
name: articles-nextjs
services:
  - name: web
    source_dir: /
    github:
      repo: yourusername/articles-nextjs
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs

databases:
  - name: db
    engine: MONGODB
    version: "6"
```

## مراقبة الإنتاج

### 1. PM2 Monitoring

```bash
# عرض حالة التطبيق
pm2 status

# عرض السجلات
pm2 logs articles-nextjs

# مراقبة الأداء
pm2 monit

# إعادة تشغيل التطبيق
pm2 restart articles-nextjs
```

### 2. Nginx Monitoring

```bash
# عرض سجلات Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# فحص حالة Nginx
sudo systemctl status nginx
```

### 3. MongoDB Monitoring

```bash
# فحص حالة MongoDB
sudo systemctl status mongod

# عرض سجلات MongoDB
sudo tail -f /var/log/mongodb/mongod.log

# مراقبة الأداء
mongostat
```

## النسخ الاحتياطية

### 1. نسخ احتياطي لقاعدة البيانات

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mongodb"
DB_NAME="articles-database"

# إنشاء مجلد النسخ الاحتياطية
mkdir -p $BACKUP_DIR

# نسخ احتياطي
mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE

# ضغط النسخة الاحتياطية
tar -czf $BACKUP_DIR/$DATE.tar.gz $BACKUP_DIR/$DATE

# حذف النسخة غير المضغوطة
rm -rf $BACKUP_DIR/$DATE

# حذف النسخ القديمة (أكثر من 7 أيام)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### 2. نسخ احتياطي للتطبيق

```bash
#!/bin/bash
# app-backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/articles-nextjs"
BACKUP_DIR="/backup/app"

# إنشاء مجلد النسخ الاحتياطية
mkdir -p $BACKUP_DIR

# نسخ احتياطي للتطبيق
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C $APP_DIR .

echo "App backup completed: $DATE"
```

### 3. جدولة النسخ الاحتياطية

```bash
# إضافة إلى crontab
crontab -e

# نسخ احتياطي يومي في الساعة 2 صباحاً
0 2 * * * /path/to/backup.sh

# نسخ احتياطي أسبوعي للتطبيق
0 3 * * 0 /path/to/app-backup.sh
```

## استكشاف الأخطاء

### 1. مشاكل شائعة

```bash
# فحص حالة الخدمات
sudo systemctl status nginx
sudo systemctl status mongod
pm2 status

# فحص المنافذ
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :27017

# فحص مساحة القرص
df -h

# فحص استخدام الذاكرة
free -h
```

### 2. سجلات الأخطاء

```bash
# سجلات التطبيق
pm2 logs articles-nextjs --lines 100

# سجلات Nginx
sudo tail -f /var/log/nginx/error.log

# سجلات النظام
sudo journalctl -u nginx -f
sudo journalctl -u mongod -f
```

### 3. اختبار الأداء

```bash
# اختبار HTTP
curl -I http://localhost:3000

# اختبار قاعدة البيانات
mongo articles-database --eval "db.articles.count()"

# اختبار الأداء
ab -n 1000 -c 10 http://localhost:3000/api/articles
```

## الأمان في الإنتاج

### 1. إعدادات الأمان

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# إعداد firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# إعداد fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

### 2. مراقبة الأمان

```bash
# فحص محاولات الدخول
sudo grep "Failed password" /var/log/auth.log

# فحص الاتصالات المشبوهة
sudo netstat -tulpn | grep :22

# فحص العمليات النشطة
ps aux | grep node
```

### 3. تحديثات الأمان

```bash
# تحديث التبعيات
npm audit
npm audit fix

# تحديث النظام
sudo apt update && sudo apt upgrade -y

# إعادة تشغيل الخدمات
sudo systemctl restart nginx
sudo systemctl restart mongod
pm2 restart all
```

---

**آخر تحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الإصدار**: 1.0.0
