const { Pool } = require('pg');

const config = {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
}

if (process.env.NODE_ENV === 'production') {
    config.ssl = {
        rejectUnauthorized: false,
    }
}

const pool = new Pool(config);

module.exports = {
    query: (text, params) => {
        return pool.query(text, params);
    },
}
