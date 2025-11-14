// scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../src/models/user.js';

dotenv.config();

// اقرأ الإعدادات من متغيرات البيئة أو استبدلها مباشرة
const MONGODB_URI     = process.env.MONGODB_URI;
const JWT_SECRET      = process.env.JWT_SECRET;
const SALT_ROUNDS     = 10;

// يمكنك تغيير القيم هنا أو تمريرها عبر متغيرات البيئة
const ADMIN_USERNAME  = process.env.ADMIN_USERNAME  || 'admin';
const ADMIN_EMAIL     = process.env.ADMIN_EMAIL     || 'admin@yourdomain.com';
const ADMIN_PASSWORD  = process.env.ADMIN_PASSWORD  || 'ChangeMe123!';

async function main() {
  // 1. اتصال بقاعدة البيانات
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✓ MongoDB connected');

  // 2. تحقق إذا كان الأدمن موجود بالفعل
  let user = await User.findOne({ username: ADMIN_USERNAME });
  if (user) {
    console.log(`⚠️  المستخدم "${ADMIN_USERNAME}" موجود مسبقاً، سيتم استخدامه.`);
  } else {
    // 3. تجزئة كلمة المرور وإنشاء المستخدم
    const hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    user = await User.create({
      username: ADMIN_USERNAME,
      email:    ADMIN_EMAIL,
      password: hash,
      role:     'admin'
    });
    console.log(`✓ Admin user "${ADMIN_USERNAME}" created.`);
  }

  // 4. توليد التوكن للمدى القصير (مثلاً 8 ساعات)
  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  console.log('\n———  Admin JWT Token  ———');
  console.log(token);
  console.log('———————————————\n');

  // 5. فصل الاتصال
  await mongoose.disconnect();
  console.log('✓ MongoDB disconnected');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
