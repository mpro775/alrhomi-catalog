# Admin Stats Module

الموديول يوفّر إحصائيات لحالة معالجة الصور في لوحة تحكم الأدمن. يعتمد على NestJS، MongoDB (عبر Mongoose)، وطابور Bull لمراقبة المهام.

## مكونات الموديول
- `AdminStatsModule`: يربط مخطط `Image` ويجهّز طابور `image-processing`، ويصدّر الخدمة لإعادة الاستخدام.
- `AdminStatsController`: يعرض واجهة `GET /admin/stats` محمية بحراسات JWT + أدوار الأدمن مع توثيق Swagger.
- `AdminStatsService`: ينفّذ حساب الإحصائيات من MongoDB وطابور Bull ويعيد مجموعة القيم المطلوبة (`totalImages`, `watermarkedCount`, `pendingJobs`).

## المتطلبات المسبقة
- تهيئة اتصال MongoDB وتحميل مخطط `Image`.
- إعداد Bull مع الطابور `image-processing` ومزوّد Redis يعمل.
- تفعيل `JwtAuthGuard`, `RolesGuard`, ودور `admin`.

## التدفق الرئيسي
- الاستدعاء `GET /admin/stats` يقوم بـ:
  1. احتساب إجمالي الصور (`totalImages`).
  2. احتساب الصور المعلمة بعلامة مائية (`watermarkedCount`).
  3. استرجاع عدد المهام المعلّقة/الفعالة/المؤجلة من طابور Bull ثم جمعها في `pendingJobs`.

## التوسع والاختبارات
- يمكن إضافة خصائص إحصائية جديدة عبر توسيع `AdminStatsService`.
- اختبر الخدمة باستخدام قواعد بيانات وطابور Bull وهمي أو مهيأ للاختبار للتأكد من صحة القيم المرجعة.

