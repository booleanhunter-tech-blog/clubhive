import {
    updateRooms,
    updateRoomInfo,
} from './store.js';

/**
 * Fetch all active rooms. Optionally pass in a userId to retrieve rooms from clubs that the user follows
 * @typedef {import('./store').Room} Room
 * @param {string} [userId]
 * @return {Promise<Room[]>} Array of rooms
 */
export async function fetchRooms(userId) {
    const url = userId ? `/rooms?userId=${userId}` : '/rooms';

    const response = await fetch(url, {
        method: 'GET'
    });

    if (response.ok) {
        const result = await response.json();
        updateRooms(result.rooms);
        return result
    } else {
        return Promise.reject(Error(response.statusText));
    }
}

/**
 * Fetch details for a room
 * @typedef {import('./store').RoomInfo} RoomInfo
 * @param {string} roomId
 * @return {Promise<Room>} Room details
 */
export async function fetchRoomDetails(roomId) {
    const response = await fetch(`/rooms/${roomId}`, {
        method: 'GET'
    });

    if (response.ok) {
        const result = await response.json();
        updateRoomInfo(result.room);
        return result
    } else {
        return Promise.reject(Error(response.statusText));
    }
}
