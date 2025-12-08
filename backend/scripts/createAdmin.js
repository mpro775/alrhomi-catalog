// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// تحميل dotenv من مجلد backend (اختياري)
let dotenvLoaded = false;
try {
  const dotenv = require('dotenv');
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    dotenvLoaded = true;
  } else {
    // محاولة تحميل من المجلد الحالي
    dotenv.config();
    dotenvLoaded = true;
  }
} catch (e) {
  // dotenv غير متاح، سنقرأ .env يدوياً أو نعتمد على environment variables
  dotenvLoaded = false;
}

// إذا لم يكن dotenv متاحاً، قراءة .env يدوياً
if (!dotenvLoaded) {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      // تجاهل التعليقات والأسطر الفارغة
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const equalIndex = trimmedLine.indexOf('=');
        if (equalIndex > 0) {
          const key = trimmedLine.substring(0, equalIndex).trim();
          const value = trimmedLine.substring(equalIndex + 1).trim();
          // إزالة علامات الاقتباس إذا كانت موجودة
          const cleanValue = value.replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = cleanValue;
          }
        }
      }
    }
  }
}

// اقرأ إعدادات MongoDB من متغيرات البيئة
// الأولوية لـ MONGODB_URI (مثل MongoDB Atlas connection string)
let MONGODB_URI = process.env.MONGODB_URI;

// إذا لم يكن MONGODB_URI موجوداً، نحاول بناءه من المتغيرات الأخرى (للتوافق مع الإصدارات القديمة)
if (!MONGODB_URI) {
  const MONGO_ROOT_USERNAME = process.env.MONGO_ROOT_USERNAME;
  const MONGO_ROOT_PASSWORD = process.env.MONGO_ROOT_PASSWORD;
  const MONGODB_PORT = process.env.MONGODB_PORT || '27017';
  const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
  const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'product-catalog';

  if (MONGO_ROOT_USERNAME && MONGO_ROOT_PASSWORD) {
    // بناء URI مع المصادقة
    MONGODB_URI = `mongodb://${encodeURIComponent(MONGO_ROOT_USERNAME)}:${encodeURIComponent(MONGO_ROOT_PASSWORD)}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=admin`;
  } else {
    // بدون مصادقة (للتطوير المحلي فقط)
    MONGODB_URI = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`;
    console.warn('⚠️  تحذير: لا توجد بيانات مصادقة MongoDB. تأكد من أن MongoDB لا يتطلب مصادقة.');
  }
}

// التحقق من وجود MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌ خطأ: يجب توفير MONGODB_URI في ملف .env');
  console.error(
    '   مثال: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database',
  );
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

// يمكنك تغيير القيم هنا أو تمريرها عبر متغيرات البيئة
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

// تعريف Schema (مطابق لـ user.schema.ts)
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['rep', 'admin'], default: 'rep' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

async function main() {
  try {
    // 1. اتصال بقاعدة البيانات
    console.log('🔄 جاري الاتصال بقاعدة البيانات...');

    // عرض معلومات الاتصال (بدون كلمة المرور)
    const uriForDisplay = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    console.log(`📡 MongoDB URI: ${uriForDisplay}`);

    await mongoose.connect(MONGODB_URI);
    console.log('✓ تم الاتصال بقاعدة البيانات بنجاح');

    // 2. إنشاء Model
    const User = mongoose.model('User', UserSchema);

    // 3. تحقق إذا كان الأدمن موجود بالفعل
    let user = await User.findOne({ username: ADMIN_USERNAME }).exec();

    if (user) {
      console.log(`⚠️  المستخدم "${ADMIN_USERNAME}" موجود مسبقاً.`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Role: ${user.role}`);
    } else {
      // 4. تجزئة كلمة المرور وإنشاء المستخدم
      console.log('🔄 جاري إنشاء المستخدم الأدمن...');
      const hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
      user = await User.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: hash,
        role: 'admin',
      });
      console.log(`✓ تم إنشاء المستخدم الأدمن "${ADMIN_USERNAME}" بنجاح.`);
      console.log(`📧 Email: ${ADMIN_EMAIL}`);
      console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
      console.log(`⚠️  احفظ كلمة المرور في مكان آمن!`);
    }

    // 5. توليد التوكن (صالح لمدة 7 أيام)
    const token = jwt.sign({ sub: user._id.toString(), role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('\n' + '='.repeat(60));
    console.log('🎫 Admin JWT Token (صالح لمدة 7 أيام):');
    console.log('='.repeat(60));
    console.log(token);
    console.log('='.repeat(60));
    console.log('\n💡 استخدم هذا التوكن في Header:');
    console.log('   Authorization: Bearer ' + token.substring(0, 50) + '...\n');

    // 6. فصل الاتصال
    await mongoose.disconnect();
    console.log('✓ تم قطع الاتصال بقاعدة البيانات');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

main();
