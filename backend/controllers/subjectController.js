
import db from '../config/db.js';

export const getSubjects = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM subjects WHERE user_id = ?', [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'فشل جلب المواد' });
    }
};

export const upsertSubject = async (req, res) => {
    const { id, name, color, icon } = req.body;
    try {
        await db.execute(
            'INSERT INTO subjects (id, user_id, name, color, icon) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, color=?, icon=?',
            [id, req.user.id, name, color, icon, name, color, icon]
        );
        res.json({ id, name, color, icon });
    } catch (error) {
        res.status(500).json({ error: 'فشل حفظ المادة' });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        await db.execute('DELETE FROM subjects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'فشل حذف المادة' });
    }
};
