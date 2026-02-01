
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Logger لتعقب الطلبات
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// المسارات الأساسية للاختبار (تمنع ظهور 404 عند فتح الرابط)
app.get('/', (req, res) => {
    res.json({ 
        message: 'مرحباً بك في خادم مخطط الدراسة (Study Planner API)',
        status: 'يعمل ✅',
        client_url: 'يرجى فتح التطبيق من رابط الـ Frontend (Vite)'
    });
});

app.get('/api', (req, res) => {
    res.json({ message: 'API Root - استخدم المسارات المحددة مثل /api/auth/login' });
});

// Health Check
app.get('/health', (req, res) => res.send('الخادم يعمل بشكل ممتاز ✅'));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sessions', sessionRoutes);

// معالج للمسارات غير الموجودة (404)
app.use((req, res) => {
    console.error(`❌ 404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        error: 'المسار غير موجود في الخادم',
        path: req.url,
        method: req.method
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Study Planner Backend Running on Port ${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});
