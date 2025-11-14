# دليل سريع لتشغيل الباك إند مع Docker / Quick Start Guide

## التشغيل السريع / Quick Start

### 1. إعداد ملف البيئة

```bash
cd backend
cp .env.example .env  # أو أنشئ ملف .env يدوياً
nano .env  # عدّل القيم حسب احتياجك
```

### 2. بناء وتشغيل الحاويات

```bash
# بناء الصور
docker-compose build

# تشغيل جميع الخدمات
docker-compose up -d

# عرض السجلات
docker-compose logs -f
```

### 3. التحقق من التشغيل

```bash
# فحص حالة الخدمات
docker-compose ps

# فحص صحة التطبيق
curl http://localhost:5000/health/live
curl http://localhost:5000/health/ready

# فتح Swagger Documentation
# افتح المتصفح على: http://localhost:5000/api-docs
```

## الأوامر الشائعة / Common Commands

```bash
# إيقاف الخدمات
docker-compose down

# إيقاف مع حذف البيانات
docker-compose down -v

# إعادة تشغيل خدمة معينة
docker-compose restart backend

# عرض سجلات خدمة معينة
docker-compose logs -f backend

# تحديث الكود وإعادة البناء
git pull
docker-compose build backend
docker-compose up -d backend
```

## على VPS / On VPS

راجع ملف `DEPLOYMENT.md` للتعليمات الكاملة.

