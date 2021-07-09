/**
 * Current session & participation details
 * @typedef {Object} UserInfo
 * @property {string} id
 * @property {string} name
 * @property {string} username
 */

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
 * Current session & participation details
 * @typedef {Object} ParticipationInfo
 * @property {string} name
 * @property {string} user_id
 * @property {string} room_id
 * @property {string} role
 * @property {Date} join_date
 * @property {string} peer_id
 */

/**
 * Current User Info
 * @type {UserInfo}
 */
export let USER_INFO = {};

/**
 * Array of rooms.
 * @type {Room[]}
 */
export let ROOMS = [];

/**
 * Room details
 * @type {RoomInfo}
 */
export let ROOM_INFO = {};

/**
 * Participation info when you join a room
 * @type {ParticipationInfo}
 */
export let PARTICIPATION_INFO = {};

/**
 * Peer ID in-order to establish webrtc connection
 * @type {string}
 */
export let PEER_ID;

/**
 * Save user's information
 * @param {UserInfo} userInfo
 */
export function updateUserInfo(userInfo) {
    USER_INFO = userInfo;
}

/**
 * Save room list
 * @param {Room[]} rooms
 */
export function updateRooms(rooms) {
    ROOMS = rooms;
}

/**
 * Save details about the current room
 * @param {RoomInfo} roomInfo
 */
export function updateRoomInfo(roomInfo) {
    ROOM_INFO = roomInfo;
}

/**
 * Save details about the current participation info
 * @param {ParticipationInfo} participant
 */
export function updateParticipationInfo(participant) {
    PARTICIPATION_INFO = participant;
}

/**
 * Save details about the current participation info
 * @param {string} peerId
 */
export function updatePeerId(peerId) {
    PEER_ID = peerId;
}
