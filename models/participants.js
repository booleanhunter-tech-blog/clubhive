const db = require('./db');

/**
 * Participant Data
 * @typedef {Object} Participant
 * @property {string} user_id
 * @property {string} room_id
 * @property {string} role
 * @property {Date} [join_date]
 * @property {string} peer_id
 */

/**
 * Adds a room participant
 * @param {Participant} participant
 * @return {Promise<Participant>} Participant
 */
async function addParticipant(participant) {
    try {
        const text = `
        INSERT INTO participants (room_id, user_id, role, peer_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (room_id, user_id)
        DO
            UPDATE
                SET join_date = NOW(), peer_id = $4
            WHERE participants.room_id = $1 AND participants.user_id = $2
        RETURNING *
        `;

        const values = [participant.room_id, participant.user_id, participant.role, participant.peer_id];
        const res = await db.query(text, values);
        return res.rows[0];
        
    } catch (err) {
        console.log(err.stack);
    }
}

/**
 * Updates a room participant
 * @param {string} roomId
 * @param {string} userId
 * @param {string} peerId
 * @return {Promise<Participant>} Participant
 */
async function updateParticipant(roomId, userId, peerId) {
    try {
        const text = `
        UPDATE participants SET peer_id = $1
        WHERE room_id = $2 AND user_id = $3
        RETURNING *
        `;

        const values = [peerId, roomId, userId];
        const res = await db.query(text, values);
        return res.rows[0];
        
    } catch (err) {
        console.log(err.stack);
    }
}

/**
 * Removes a room participant
 * @param {string} roomId
 * @param {string} userId
 * @return {Promise<Participant>} Participant
 */
async function removeParticipant(roomId, userId) {
    try {
        const text = `
        DELETE FROM participants
        WHERE room_id = $1 AND user_id = $2
        RETURNING *
        `;

        const values = [roomId, userId];
        const res = await db.query(text, values);
        return res.rows[0];
        
    } catch (err) {
        console.log(err.stack);
    }
}

module.exports = {
    addParticipant,
    updateParticipant,
    removeParticipant,
}
