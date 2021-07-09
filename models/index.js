const db = require('./db');

/**
 * Room list object
 * @typedef {Object} Room
 * @property {string} id
 * @property {string} name
 * @property {string} club_name
 * @property {Object[]} panel
 * @property {number} panel_count
 * @property {number} participant_count
 */

/**
 * Room details object
 * @typedef {Object} RoomInfo
 * @property {string} id
 * @property {string} name
 * @property {string} club_name
 * @property {Object[]} panel
 * @property {Object[]} audience
 */

/**
 * Get rooms
 * @param {number} limit
 * @return {Promise<Room[]>} Array of rooms
 */
async function getRooms(limit) {
    try {
       const text =
        `SELECT
            rooms.id,
            rooms.name,
            clubs.name AS club_name,
            ( 
                SELECT json_agg(participant)
                FROM (
                    SELECT participants.user_id, participants.role, users.name
                    FROM participants
                    INNER JOIN users
                        ON participants.user_id = users.id
                        WHERE participants.room_id = rooms.id
                        AND participants.role IN ('HOST', 'MODERATOR', 'SPEAKER')
                    LIMIT 6
                ) participant
            ) AS panel,

            COUNT(participants.user_id) FILTER (
                WHERE participants.room_id = rooms.id
                AND participants.role NOT IN ('AUDIENCE')
            ) as panel_count,

            COUNT(participants.user_id) FILTER (
                WHERE participants.room_id = rooms.id
            ) as participant_count

        FROM clubs

        RIGHT JOIN rooms
            ON rooms.club_id = clubs.id

        INNER JOIN participants
            ON participants.room_id = rooms.id
            
        GROUP BY rooms.id, rooms.name, clubs.name
        ORDER BY rooms.date DESC
        LIMIT $1
        `;

        const values = [limit];

        const res = await db.query(text, values);
        return res.rows;
    } catch (err) {
        console.log(err.stack);
    }
}

/**
 * Get rooms of clubs followed by the user
 * @param {string} userId
 * @param {number} limit
 * @return {Promise<Room[]>} Array of rooms
 */
async function getRoomsForUser(userId, limit) {
    try {
        const text = `
        SELECT
            rooms.id,
            rooms.name,
            clubs.name AS club_name,
            ( 
                SELECT json_agg(participant)
                FROM (
                    SELECT participants.user_id, participants.role, users.name
                    FROM participants
                    INNER JOIN users
                        ON participants.user_id = users.id
                        WHERE participants.room_id = rooms.id
                        AND participants.role != 'AUDIENCE'
                    LIMIT 6
                ) participant
            ) AS panel,

            COUNT(participants.user_id) FILTER (
                WHERE participants.room_id = rooms.id
                AND participants.role != 'AUDIENCE'
            ) as panel_count,

            COUNT(participants.user_id) FILTER (
                WHERE participants.room_id = rooms.id
            ) as participant_count

        FROM clubs

        RIGHT JOIN rooms
            ON rooms.club_id = clubs.id

        INNER JOIN participants
            ON participants.room_id = rooms.id

        LEFT JOIN followers
            ON followers.club_id = clubs.id

        WHERE followers.user_id = $1
            OR rooms.club_id IS NULL

        GROUP BY rooms.id, rooms.name, clubs.name
        ORDER BY rooms.date DESC
        LIMIT $2
        `;

        const values = [userId, limit];

        const res = await db.query(text, values);
        return res.rows;
    } catch (err) {
        console.log(err.stack);
    }
}

/**
 * Get room info
 * @param {string} roomId
 * @return {Promise<RoomInfo>} Room Info
 */
async function getRoomDetails(roomId) {
    try {
        const text = `
        SELECT
            rooms.id,
            rooms.name,
            clubs.name AS club_name,
            (
                SELECT json_agg(participant)
                FROM (
                    SELECT participants.user_id, participants.role, participants.peer_id, users.name
                    FROM participants, users
                        WHERE participants.user_id = users.id
                        AND participants.room_id = rooms.id
                        AND participants.role IN ('HOST', 'MODERATOR','SPEAKER')
                ) participant
            ) AS panel,

            (
                SELECT json_agg(participant)
                FROM (
                    SELECT participants.user_id, participants.role, participants.peer_id, users.name
                    FROM participants, users
                        WHERE participants.user_id = users.id
                        AND participants.room_id = rooms.id
                        AND participants.role = 'AUDIENCE'
                ) participant
            ) AS audience
 
        FROM rooms
        LEFT JOIN clubs
            ON rooms.club_id = clubs.id
        WHERE rooms.id = $1
        `;

        const values = [roomId];
        const res = await db.query(text, values);
        return res.rows[0];
    } catch (err) {
        console.log(err.stack);
    }
}

module.exports = {
    getRooms,
    getRoomsForUser,
    getRoomDetails,
}
