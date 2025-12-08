# دليل نشر المشروع على VPS

## المتطلبات

- VPS مع Ubuntu 22.04+ أو أي توزيعة Linux
- دومين موجه للـ VPS:
  - `m-dowaid.pro` → IP الخادم
  - `api.m-dowaid.pro` → IP الخادم
- Docker و Docker Compose مثبتين
- حساب MongoDB Atlas جاهز
- حساب AWS S3 جاهز

---

## الخطوة 1: إعداد DNS

قبل البدء، تأكد من إعداد سجلات DNS:

```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     300
A       api     YOUR_VPS_IP     300
```

انتظر حتى تنتشر سجلات DNS (قد يستغرق من دقائق إلى ساعات).

للتحقق:
```bash
ping m-dowaid.pro
ping api.m-dowaid.pro
```

---

## الخطوة 2: إعداد VPS

### الاتصال بالخادم
```bash
ssh root@YOUR_VPS_IP
```

### تحديث النظام
```bash
apt update && apt upgrade -y
```

### تثبيت Docker
```bash
# تثبيت المتطلبات
apt install -y apt-transport-https ca-certificates curl software-properties-common

# إضافة مفتاح Docker GPG
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# إضافة مستودع Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# تثبيت Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# التحقق من التثبيت
docker --version
docker compose version
```

### إعداد Firewall
```bash
# تثبيت UFW إذا لم يكن مثبتاً
apt install -y ufw

# السماح بالمنافذ المطلوبة
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# تفعيل الجدار الناري
ufw enable
ufw status
```

---

## الخطوة 3: رفع المشروع

### إنشاء مجلد المشروع
```bash
mkdir -p /opt/alrhomi-catalog
cd /opt/alrhomi-catalog
```

### رفع الملفات (من جهازك المحلي)
```bash
# من جهازك المحلي، استخدم rsync أو scp
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /path/to/alrhomi-catalog/ root@YOUR_VPS_IP:/opt/alrhomi-catalog/

# أو باستخدام scp
scp -r /path/to/alrhomi-catalog/* root@YOUR_VPS_IP:/opt/alrhomi-catalog/
```

### أو استخدام Git
```bash
cd /opt
git clone YOUR_REPOSITORY_URL alrhomi-catalog
cd alrhomi-catalog
```

---

## الخطوة 4: إعداد ملف البيئة

```bash
cd /opt/alrhomi-catalog

# نسخ ملف المثال
cp env.example .env

# تعديل الملف
nano .env
```

**قم بتعديل القيم التالية:**

```bash
# MongoDB Atlas - احصل على الرابط من لوحة تحكم Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/product-catalog

# JWT Secret - أنشئ مفتاح قوي
JWT_SECRET=$(openssl rand -base64 64)

# AWS S3
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=your-bucket

# البريد الإلكتروني لشهادة SSL
CERTBOT_EMAIL=your-email@example.com
```

---

## الخطوة 5: الحصول على شهادة SSL

### إنشاء المجلدات المطلوبة
```bash
mkdir -p certbot/www certbot/conf
```

### استخدام التكوين المبدئي (بدون SSL)
```bash
# نسخ التكوين المبدئي
cp nginx/conf.d/default.conf.initial nginx/conf.d/default.conf.backup
cat nginx/conf.d/default.conf.initial > nginx/conf.d/default.conf
```

### تشغيل Nginx مؤقتاً
```bash
docker compose -f docker-compose.prod.yml up -d nginx
```

### الحصول على الشهادة
```bash
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email YOUR_EMAIL@example.com \
  --agree-tos \
  --no-eff-email \
  -d m-dowaid.pro \
  -d api.m-dowaid.pro
```

### إيقاف Nginx وإعادة التكوين الكامل
```bash
docker compose -f docker-compose.prod.yml down

# استعادة التكوين الكامل مع SSL
cat nginx/conf.d/default.conf.backup > /dev/null 2>&1 || true
# التكوين الكامل موجود بالفعل في default.conf الأصلي
```

---

## الخطوة 6: تشغيل المشروع

### بناء وتشغيل جميع الخدمات
```bash
cd /opt/alrhomi-catalog

# بناء الصور
docker compose -f docker-compose.prod.yml build

# تشغيل الخدمات
docker compose -f docker-compose.prod.yml up -d

# التحقق من حالة الخدمات
docker compose -f docker-compose.prod.yml ps
```

### التحقق من السجلات
```bash
# جميع الخدمات
docker compose -f docker-compose.prod.yml logs -f

# خدمة محددة
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f nginx
```

---

## الخطوة 7: إنشاء حساب المسؤول

```bash
docker compose -f docker-compose.prod.yml exec backend node scripts/createAdmin.js
```

---

## الخطوة 8: التحقق من العمل

افتح في المتصفح:
- **الموقع**: https://m-dowaid.pro
- **API**: https://api.m-dowaid.pro/health/live
- **Swagger**: https://api.m-dowaid.pro/api (إذا كان مفعلاً)

---

## الصيانة والإدارة

### إعادة التشغيل
```bash
docker compose -f docker-compose.prod.yml restart
```

### إيقاف الخدمات
```bash
docker compose -f docker-compose.prod.yml down
```

### تحديث المشروع
```bash
cd /opt/alrhomi-catalog

# سحب التحديثات (إذا كنت تستخدم Git)
git pull

# إعادة البناء
docker compose -f docker-compose.prod.yml build --no-cache

# إعادة التشغيل
docker compose -f docker-compose.prod.yml up -d
```

### تجديد شهادة SSL
```bash
docker compose -f docker-compose.prod.yml run --rm certbot renew
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### النسخ الاحتياطي
```bash
# نسخ ملفات التحميل
tar -czvf uploads-backup-$(date +%Y%m%d).tar.gz backend/uploads/

# نسخ بيانات Redis
docker compose -f docker-compose.prod.yml exec redis redis-cli BGSAVE
```

### مسح ذاكرة التخزين المؤقت
```bash
docker compose -f docker-compose.prod.yml exec redis redis-cli FLUSHALL
```

---

## استكشاف الأخطاء

### مشكلة: الموقع لا يعمل
```bash
# تحقق من حالة الحاويات
docker compose -f docker-compose.prod.yml ps

# تحقق من سجلات nginx
docker compose -f docker-compose.prod.yml logs nginx

# تحقق من أن المنافذ مفتوحة
netstat -tlnp | grep -E '80|443'
```

### مشكلة: خطأ في الاتصال بقاعدة البيانات
```bash
# تحقق من سجلات الباك إند
docker compose -f docker-compose.prod.yml logs backend

# تحقق من MONGODB_URI في ملف .env
# تأكد من إضافة IP الخادم في قائمة السماح في MongoDB Atlas
```

### مشكلة: شهادة SSL
```bash
# تحقق من وجود الشهادات
ls -la certbot/conf/live/m-dowaid.pro/

# إعادة الحصول على الشهادة
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email YOUR_EMAIL@example.com \
  --agree-tos \
  --force-renewal \
  -d m-dowaid.pro \
  -d api.m-dowaid.pro
```

### مشكلة: نفاد المساحة
```bash
# تنظيف Docker
docker system prune -af
docker volume prune -f
```

### مشكلة: الذاكرة
```bash
# التحقق من استخدام الموارد
docker stats

# إعادة تشغيل خدمة معينة
docker compose -f docker-compose.prod.yml restart backend
```

---

## أوامر مفيدة

```bash
# دخول حاوية الباك إند
docker compose -f docker-compose.prod.yml exec backend sh

# دخول حاوية Redis
docker compose -f docker-compose.prod.yml exec redis redis-cli

# عرض استخدام الموارد
docker stats

# عرض المساحة المستخدمة
docker system df

# إعادة تحميل Nginx بدون إيقاف
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

---

## هيكل المشروع على الخادم

```
/opt/alrhomi-catalog/
├── docker-compose.prod.yml
├── .env
├── env.example
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       ├── default.conf
│       └── default.conf.initial
├── certbot/
│   ├── www/
│   └── conf/
├── frontend/
│   ├── Dockerfile
│   └── ...
└── backend/
    ├── Dockerfile
    ├── uploads/
    └── ...
```

---

## ملاحظات أمنية

1. **لا تشارك ملف `.env`** - يحتوي على معلومات حساسة
2. **قم بتغيير `JWT_SECRET`** - استخدم قيمة عشوائية قوية
3. **أضف IP الخادم في MongoDB Atlas** - Network Access → Add IP Address
4. **راجع سجلات الوصول بانتظام** - `/var/log/nginx/access.log`
5. **قم بتحديث النظام دورياً** - `apt update && apt upgrade`

