
import mysql from 'mysql2/promise';

// ملاحظة: هذه القيم سيتم جلبها من لوحة تحكم الاستضافة (Environment Variables)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    user: process.env.DB_USER || '3pwXHm3PBTNAZjS.root',
    password: process.env.DB_PASSWORD || 'OBNbDartx9gNQOOb',
    database: process.env.DB_NAME || 'study_planner_db',
    port: process.env.DB_PORT || 4000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false // مطلوب لمعظم الاستضافات السحابية مثل TiDB
    }
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to Cloud MySQL Database!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

export default pool;
