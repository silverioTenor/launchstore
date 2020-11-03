import { Pool } from 'pg';

const db = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'launchstore'
});

export default db;