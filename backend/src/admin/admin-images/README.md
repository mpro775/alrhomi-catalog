# Admin Images Module

هذا الموديول يوفر واجهات إدارة صور المنتجات في لوحة التحكم. يعتمد على NestJS و MongoDB (عبر Mongoose) مع تكامل تخزين الملفات على S3.

## مكونات الموديول
- `AdminImagesModule`: يقوم بتسجيل مخططات `Image`, `Product`, `JobStatus` ويصدّر الخدمة لإعادة استخدامها.
- `AdminImagesController`: واجهات REST `GET /admin/images` و `DELETE /admin/images/:id` مع حماية `JwtAuthGuard` و `RolesGuard` ودور `admin`.
- `AdminImagesService`: يحتوي منطق العمل الأساسي للبحث عن الصور، جلب تفاصيل مرتبطة بالمنتج وحالة المعالجة، وحذف الصور من قاعدة البيانات و S3.
- `AdminImageQueryDto`: يعرّف معاملات التصفية (page, limit, search) مع التحقق والتوثيق عبر Swagger.

## المتطلبات المسبقة
- إعداد متغيرات البيئة الخاصة بـ AWS (`aws.region`, `aws.accessKeyId`, `aws.secretAccessKey`, `aws.bucket`).
- وجود مخططات Mongoose (`Image`, `Product`, `JobStatus`) في `backend/src/database/schemas`.
- تفعيل حراس المصادقة (`JwtAuthGuard`, `RolesGuard`) ودور `admin`.

## التدفقات الرئيسية
1. **استعراض الصور**  
   - يدعم التصفح مع ترقيم الصفحات (افتراضياً 24 عنصر/صفحة).  
   - خيار `search` يطبق Regex على خصائص المنتج (`model`, `productName`, `tags`, `note`).  
   - يتم إرجاع البيانات مرفقة بحالة مهمة المعالجة (`JobStatus`) ونسبة التقدم.

2. **حذف صورة**  
   - يتحقق من وجود الوثيقة.  
   - يحذف الملفات من S3 (`originals/<file>` و `watermarked/<id>.png`) مع تجاوز أخطاء `NoSuchKey`.  
   - يزيل السجل من MongoDB ويعيد رسالة نجاح.

## الاستخدام في وحدات أخرى
- يمكن استيراد `AdminImagesModule` أو استعمال `AdminImagesService` مباشرة عبر التصدير في `providers`.
- عند الحاجة لتوسيع الوظائف (مثلاً تحديث الحالة أو رفع صورة)، أضف النقاط اللازمة في الخدمة مع الحفاظ على الحماية في الكنترولر.

## الاختبارات والضمانات
- يُنصح بإضافة اختبارات تكامل تغطي التدفق الكامل (بحث، حذف).  
- تأكد من تهيئة AWS S3 و MongoDB في بيئة الاختبار أو استبدالها بواجهات وهمية.

