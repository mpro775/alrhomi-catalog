// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// اقرأ الإعدادات من متغيرات البيئة
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/product-catalog';
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
