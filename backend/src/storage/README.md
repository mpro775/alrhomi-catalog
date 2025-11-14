# Storage Module

وحدة التخزين تتولى التعامل مع AWS S3 لرفع الملفات، توليد روابط التحميل المؤقتة، وتنزيل الملفات الخام. تُستخدم من قبل وحدات مثل الصور لإدارة أصول الوسائط.

## المكوّنات
- `StorageModule`: يوفّر `StorageService` كمزوّد يمكن استيراده في الوحدات الأخرى.
- `StorageService`: يغلف إعداد عميل S3 باستخدام بيانات الاعتماد من `ConfigService` (`aws.bucket`, `aws.region`, `aws.accessKeyId`, `aws.secretAccessKey`) ويعرض واجهات:
  - `uploadFile(key, body, contentType)`: يرفع ملفاً ويعيد رابطاً عاماً.
  - `generatePresignedUrl(key, expiresIn)`: يولّد رابط تحميل مؤقت مع `Content-Disposition` للتحميل.
  - `downloadFile(key)`: يعيد استجابة `GetObjectCommand`.

## المتطلبات
- تهيئة إعدادات AWS في ملفات الإعداد (مثلاً `config/aws.ts` أو `.env`).  
- توفير صلاحيات IAM لرفع/قراءة الكائنات من الحاوية (`bucket`).

## الاستعمال
1. استورد `StorageModule` في الوحدات التي تحتاج التخزين (مثل `ImagesModule`).  
2. احقن `StorageService` وادعُ الطرق المناسبة (رفع الملفات بعد استخدام `multer`, توليد روابط لمشاركة الملفات، إلخ).

## التوسعة والاختبارات
- يمكن إضافة دعم لمزوّدين آخرين (MinIO, GCS) أو وظائف إضافية مثل حذف الملفات.  
- للاختبارات، استبدل `StorageService` بمحاكٍ (mock) أو استخدم حاوية S3 محلية.

