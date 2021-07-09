const db = require('./db');

/**
 * User Data
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} name
 * @property {string} bio
 * @property {Date} join_date
 */

/**
 * Get user by their username
 * @param {string} username
 * @return {Promise<User>} User
 */
async function getUserByUsername(username) {
    try {
        const text = `
        SELECT * from users
        WHERE username = $1
        `;

        const values = [username];

        const res = await db.query(text, values);
        return res.rows[0];
    } catch (err) {
        console.log(err.stack);
    }    
}

module.exports = {
    getUserByUsername,
}
