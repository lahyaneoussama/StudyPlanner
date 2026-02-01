
import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_super_secret_key_study_planner';

export const register = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'يرجى ملء جميع الحقول المطلوبة' });
        }

        // التحقق من وجود المستخدم
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'هذا البريد الإلكتروني مسجل بالفعل' });
        }

        const id = Math.random().toString(36).substr(2, 9);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.execute(
            'INSERT INTO users (id, full_name, email, password_hash, education_level, daily_study_goal, streak) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, fullName, email, hashedPassword, 'جامعي', 4, 0]
        );

        const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ 
            user: { 
                id, 
                fullName, 
                email, 
                educationLevel: 'جامعي', 
                dailyStudyGoal: 4, 
                streak: 0 
            }, 
            token 
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'البريد الإلكتروني غير موجود' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ 
            user: { 
                id: user.id, 
                fullName: user.full_name, 
                email: user.email, 
                educationLevel: user.education_level, 
                dailyStudyGoal: user.daily_study_goal, 
                streak: user.streak 
            }, 
            token 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
    }
};
