import { Pool } from 'pg';

const db = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 32769,
    database: 'launchstore_db'
});

export default db;