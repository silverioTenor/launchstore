import { Pool } from 'pg';

module.exports = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'launchstore'
});