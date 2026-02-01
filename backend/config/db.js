
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    user: '3pwXHm3PBTNAZjS.root',
    password: 'W8FBvuXY9GPUZ4u5',
    database: 'study_planner_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// اختبار الاتصال فوراً
pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL Database successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        console.error('تأكد من تشغيل XAMPP ومن وجود قاعدة البيانات study_planner_db');
    });

export default pool;
