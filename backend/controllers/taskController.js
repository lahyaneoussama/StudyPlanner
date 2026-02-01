
import db from '../config/db.js';

export const getTasks = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC', [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'فشل جلب المهام' });
    }
};

export const upsertTask = async (req, res) => {
    const { id, subject_id, title, due_date, completed } = req.body;
    try {
        const isCompleted = completed ? 1 : 0;
        await db.execute(
            'INSERT INTO tasks (id, user_id, subject_id, title, due_date, completed) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE subject_id=?, title=?, due_date=?, completed=?',
            [id, req.user.id, subject_id, title, due_date, isCompleted, subject_id, title, due_date, isCompleted]
        );
        res.json({ id, subject_id, title, due_date, completed });
    } catch (error) {
        res.status(500).json({ error: 'فشل حفظ المهمة' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        await db.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'فشل حذف المهمة' });
    }
};
