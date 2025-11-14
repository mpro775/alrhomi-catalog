# دليل نشر الباك إند على VPS / Backend Deployment Guide

## المتطلبات الأساسية / Prerequisites

- VPS مع Ubuntu 20.04+ أو Debian 11+
- Docker و Docker Compose مثبتين
- Git مثبت
- Domain name (اختياري) / Optional

---

## الخطوة 1: تثبيت Docker و Docker Compose / Step 1: Install Docker & Docker Compose

### على Ubuntu/Debian:

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# إضافة المستخدم الحالي إلى مجموعة docker
sudo usermod -aG docker $USER

# تثبيت Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# إعادة تسجيل الدخول أو تنفيذ:
newgrp docker

# التحقق من التثبيت
docker --version
docker-compose --version
```

---

## الخطوة 2: رفع الكود إلى VPS / Step 2: Upload Code to VPS

### الطريقة 1: استخدام Git (مُوصى به)

```bash
# على VPS
cd /opt
sudo git clone <your-repository-url> alrhomi-catalog
cd alrhomi-catalog/backend
```

### الطريقة 2: استخدام SCP من جهازك المحلي

```bash
# من جهازك المحلي (Windows PowerShell)
scp -r backend user@your-vps-ip:/opt/alrhomi-catalog/
```

---

## الخطوة 3: إعداد ملف البيئة / Step 3: Setup Environment File

```bash
# على VPS
cd /opt/alrhomi-catalog/backend

# إنشاء ملف .env
nano .env
```

### محتوى ملف `.env`:

```env
# Application
NODE_ENV=production
PORT=5000
SERVICE_NAME=alrhomi-catalog-backend

# Database
MONGODB_URI=mongodb://mongodb:27017/product-catalog
# أو إذا كنت تستخدم MongoDB خارجي:
# MONGODB_URI=mongodb://username:password@host:27017/product-catalog?authSource=admin

# Redis
REDIS_URL=redis://redis:6379
# أو إذا كان Redis محمي بكلمة مرور:
# REDIS_URL=redis://:password@redis:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
S3_BUCKET=your-bucket-name

# MongoDB (للاستخدام مع docker-compose)
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-strong-mongodb-password
MONGODB_PORT=27017

# Redis (للاستخدام مع docker-compose)
REDIS_PASSWORD=your-strong-redis-password
REDIS_PORT=6379
```

**⚠️ مهم:** استبدل جميع القيم الحساسة بقيمك الخاصة!

---

## الخطوة 4: بناء وتشغيل الحاويات / Step 4: Build and Run Containers

### إذا كنت تستخدم MongoDB و Redis من docker-compose:

```bash
cd /opt/alrhomi-catalog/backend

# بناء الصورة
docker-compose build

# تشغيل الحاويات
docker-compose up -d

# عرض السجلات
docker-compose logs -f backend
```

### إذا كنت تستخدم MongoDB و Redis خارجيين:

قم بتعديل `docker-compose.yml` لإزالة خدمات MongoDB و Redis، أو أنشئ `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: alrhomi-backend
    restart: unless-stopped
    ports:
      - "${PORT:-5000}:5000"
    environment:
      - NODE_ENV=production
      - PORT=${PORT:-5000}
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-15m}
      - REFRESH_TOKEN_EXPIRES_IN=${REFRESH_TOKEN_EXPIRES_IN:-7d}
      - AWS_REGION=${AWS_REGION}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - S3_BUCKET=${S3_BUCKET}
    env_file:
      - .env
    volumes:
      - ./uploads:/app/uploads
      - ./tmp:/app/tmp
    networks:
      - alrhomi-network

networks:
  alrhomi-network:
    driver: bridge
```

ثم شغّل:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## الخطوة 5: إعداد Nginx كـ Reverse Proxy (اختياري) / Step 5: Setup Nginx as Reverse Proxy (Optional)

### تثبيت Nginx:

```bash
sudo apt install nginx -y
```

### إنشاء ملف إعدادات Nginx:

```bash
sudo nano /etc/nginx/sites-available/alrhomi-backend
```

### محتوى الملف:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # استبدل بنطاقك

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

### تفعيل الموقع:

```bash
sudo ln -s /etc/nginx/sites-available/alrhomi-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### إعداد SSL مع Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

---

## الخطوة 6: إدارة الخدمة / Step 6: Service Management

### عرض الحالة:

```bash
docker-compose ps
```

### عرض السجلات:

```bash
# جميع الخدمات
docker-compose logs -f

# خدمة معينة
docker-compose logs -f backend
```

### إعادة تشغيل:

```bash
docker-compose restart backend
```

### إيقاف:

```bash
docker-compose down
```

### إيقاف مع حذف البيانات:

```bash
docker-compose down -v
```

### تحديث الكود:

```bash
cd /opt/alrhomi-catalog/backend

# سحب التحديثات
git pull

# إعادة بناء وتشغيل
docker-compose build backend
docker-compose up -d backend
```

---

## الخطوة 7: إعداد Firewall / Step 7: Setup Firewall

```bash
# تثبيت UFW
sudo apt install ufw -y

# السماح بـ SSH
sudo ufw allow 22/tcp

# السماح بـ HTTP و HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# تفعيل Firewall
sudo ufw enable

# عرض القواعد
sudo ufw status
```

---

## الخطوة 8: المراقبة والصحة / Step 8: Monitoring & Health

### فحص صحة التطبيق:

```bash
# Health check endpoint
curl http://localhost:5000/health/live
curl http://localhost:5000/health/ready
```

### مراقبة استخدام الموارد:

```bash
docker stats
```

### إعداد مراقبة تلقائية (اختياري):

يمكنك استخدام أدوات مثل:
- PM2 (لإدارة Node.js)
- Prometheus + Grafana
- أو أدوات مراقبة VPS مثل Netdata

---

## استكشاف الأخطاء / Troubleshooting

### المشكلة: التطبيق لا يعمل

```bash
# فحص السجلات
docker-compose logs backend

# فحص الحالة
docker-compose ps

# فحص الاتصال بقاعدة البيانات
docker-compose exec backend sh
# داخل الحاوية:
# ping mongodb
# ping redis
```

### المشكلة: خطأ في الاتصال بقاعدة البيانات

- تأكد من أن `MONGODB_URI` صحيح
- تأكد من أن MongoDB يعمل: `docker-compose ps mongodb`
- تأكد من أن الشبكة صحيحة في docker-compose

### المشكلة: خطأ في الاتصال بـ Redis

- تأكد من أن `REDIS_URL` صحيح
- تأكد من أن Redis يعمل: `docker-compose ps redis`
- تأكد من كلمة مرور Redis إذا كانت موجودة

### المشكلة: مشاكل في الصلاحيات

```bash
# إصلاح صلاحيات المجلدات
sudo chown -R $USER:$USER /opt/alrhomi-catalog
chmod -R 755 /opt/alrhomi-catalog/backend/uploads
chmod -R 755 /opt/alrhomi-catalog/backend/tmp
```

---

## الأمان / Security

1. **استخدم كلمات مرور قوية** لجميع الخدمات
2. **قم بتحديث النظام** بانتظام: `sudo apt update && sudo apt upgrade`
3. **استخدم SSL/HTTPS** دائماً في الإنتاج
4. **لا ترفع ملف `.env`** إلى Git
5. **استخدم secrets management** للإنتاج (مثل Docker Secrets أو Vault)
6. **قم بتفعيل Firewall** وافتح المنافذ الضرورية فقط
7. **راقب السجلات** بانتظام للأنشطة المشبوهة

---

## النسخ الاحتياطي / Backup

### نسخ احتياطي لقاعدة البيانات:

```bash
# إنشاء نسخة احتياطية
docker-compose exec mongodb mongodump --out /data/backup --db product-catalog

# نسخ النسخة الاحتياطية من الحاوية
docker cp alrhomi-mongodb:/data/backup ./backup-$(date +%Y%m%d)
```

### استعادة النسخة الاحتياطية:

```bash
docker-compose exec mongodb mongorestore /data/backup/product-catalog
```

---

## ملاحظات إضافية / Additional Notes

- تأكد من أن VPS لديه ذاكرة كافية (2GB+ موصى به)
- استخدم swap إذا كانت الذاكرة محدودة
- راقب استخدام القرص الصلب
- قم بإعداد cron jobs للنسخ الاحتياطي التلقائي

---

## الدعم / Support

إذا واجهت مشاكل، تحقق من:
- سجلات Docker: `docker-compose logs`
- سجلات Nginx: `sudo tail -f /var/log/nginx/error.log`
- حالة الخدمات: `docker-compose ps`

