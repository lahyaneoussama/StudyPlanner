
# دليل تشغيل الخلفية البرمجية (Full MVC Structure) 🚀

## 1. التثبيت (Installation)
افتح المجلد في الـ Terminal وقم بتثبيت الحزم:
```bash
npm install express mysql2 bcryptjs jsonwebtoken cors
```

## 2. الهيكل التنظيمي (Project Structure)
- `config/`: إعدادات قاعدة البيانات.
- `controllers/`: منطق العمل (Business Logic).
- `middleware/`: طبقات الأمان (Auth Protect).
- `routes/`: تعريف المسارات (Endpoints).

## 3. التشغيل (Running)
تأكد من تشغيل MySQL أولاً، ثم:
```bash
node server.js
```

النظام الآن جاهز للربط مع تطبيق Flutter أو React بكل احترافية وأمان.
