
import db from '../config/db.js';

export const getProfile = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, full_name, email, education_level, daily_study_goal, streak FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'المستخدم غير موجود' });
        
        const user = rows[0];
        res.json({
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            educationLevel: user.education_level,
            dailyStudyGoal: user.daily_study_goal,
            streak: user.streak
        });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب الملف الشخصي' });
    }
};

export const updateProfile = async (req, res) => {
    const { fullName, educationLevel, dailyStudyGoal } = req.body;
    try {
        await db.execute(
            'UPDATE users SET full_name = ?, education_level = ?, daily_study_goal = ? WHERE id = ?',
            [fullName, educationLevel, dailyStudyGoal, req.user.id]
        );
        res.json({ success: true, message: 'تم تحديث البيانات بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في تحديث البيانات' });
    }
};
