
import db from '../config/db.js';

export const getSessions = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM study_sessions WHERE user_id = ?', [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'فشل جلب الجلسات' });
    }
};

export const upsertSession = async (req, res) => {
    const { id, subject_id, day_name, start_time, duration, goal } = req.body;
    try {
        await db.execute(
            'INSERT INTO study_sessions (id, user_id, subject_id, day_name, start_time, duration, goal) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE subject_id=?, day_name=?, start_time=?, duration=?, goal=?',
            [id, req.user.id, subject_id, day_name, start_time, duration, goal, subject_id, day_name, start_time, duration, goal]
        );
        res.json({ id, subject_id, day_name, start_time, duration, goal });
    } catch (error) {
        res.status(500).json({ error: 'فشل حفظ الجلسة' });
    }
};

export const deleteSession = async (req, res) => {
    try {
        await db.execute('DELETE FROM study_sessions WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'فشل حذف الجلسة' });
    }
};
