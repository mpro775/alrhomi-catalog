# حل سريع لمشكلة MongoDB

## المشكلة
```
connect ECONNREFUSED 127.0.0.1:27017
```

## الحلول السريعة

### ✅ الحل 1: استخدام Docker (الأسهل)

1. **شغّل Docker Desktop** من قائمة Start
2. انتظر حتى يظهر "Docker Desktop is running" في شريط المهام
3. في PowerShell، شغّل:
   ```powershell
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```
4. تحقق من التشغيل:
   ```powershell
   docker ps
   ```
5. الآن جرب الاتصال من MongoDB Compass أو السيرفر

### ✅ الحل 2: تثبيت MongoDB Community Server

1. حمّل MongoDB من: https://www.mongodb.com/try/download/community
2. ثبّت MongoDB مع خيار "Install MongoDB as a Service"
3. بعد التثبيت، MongoDB سيبدأ تلقائياً
4. تحقق من الخدمة:
   ```powershell
   Get-Service MongoDB
   ```
5. إذا لم تكن قيد التشغيل:
   ```powershell
   Start-Service MongoDB
   ```

### ✅ الحل 3: استخدام MongoDB Atlas (السحابي - مجاني)

1. اذهب إلى: https://www.mongodb.com/cloud/atlas/register
2. أنشئ حساب مجاني
3. أنشئ cluster جديد (Free tier)
4. احصل على Connection String
5. عدّل ملف `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myDatabase
   ```

### ✅ الحل 4: تشغيل MongoDB يدوياً (إذا كان مثبت)

إذا كان MongoDB مثبتاً لكن الخدمة غير قيد التشغيل:

1. ابحث عن `mongod.exe` في:
   - `C:\Program Files\MongoDB\Server\[VERSION]\bin\`
   - أو `C:\MongoDB\bin\`

2. أنشئ مجلدات البيانات:
   ```powershell
   mkdir C:\data\mongodb\db
   mkdir C:\data\mongodb\log
   ```

3. شغّل MongoDB:
   ```powershell
   "C:\Program Files\MongoDB\Server\[VERSION]\bin\mongod.exe" --dbpath "C:\data\mongodb\db"
   ```

4. اترك النافذة مفتوحة وافتح نافذة PowerShell أخرى لتشغيل السيرفر

## التحقق من أن MongoDB يعمل

```powershell
netstat -ano | findstr :27017
```

يجب أن ترى MongoDB يستمع على المنفذ 27017.

## بعد تشغيل MongoDB

1. أعد تشغيل السيرفر (backend)
2. جرب الاتصال من MongoDB Compass
3. يجب أن يعمل الآن! ✅

