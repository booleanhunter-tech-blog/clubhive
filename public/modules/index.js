import {
    USER_INFO,
    ROOMS,
    ROOM_INFO,
    PARTICIPATION_INFO,
    PEER_ID,
    updateUserInfo,
    updateParticipationInfo,

} from './store.js';

import {
    fetchRooms,
    fetchRoomDetails,
} from './api.js';

import {
    selectRoomNode,
    renderRooms,
    renderRoomDetailsSection,
    displayParticipant,
    removeParticipantNode,
    resetRoomDetails,
    unselectRoomNodes,

} from './helpers.js';

import {
    closeConnections,
} from './webrtc.js';

export const socket = io();

const user = document.getElementById('user');

updateUserInfo({
    id: user.getAttribute('data-userId'),
    name: user.getAttribute('data-name'),
    username: user.getAttribute('data-username')
});

displayRooms();

socket.on('user-joined-room', handleNewParticipantJoin);
socket.on('user-left-room', handleParticipantLeave);

document.getElementById('leave-room').addEventListener('click', leaveRoom);

async function displayRooms() {
    await fetchRooms(USER_INFO.id);
    renderRooms(ROOMS);
}

export async function handleRoomSelect(e) {
    if (USER_INFO.id && PEER_ID) {
        ROOM_INFO.id && leaveRoom();

        selectRoomNode(e.currentTarget);

        const roomId = e.currentTarget.getAttribute('data-id');
        joinRoom(roomId);
    }
}

/**
 * Join a room
 * @param {string} roomId - ID of the room
 */
function joinRoom(roomId) {
    socket.emit('user-joined-room', {
        roomId,
        user: USER_INFO,
        peer_id: PEER_ID,
    }, async (response) => {
        
        updateParticipationInfo(response);
        console.log('PARTICIPATION_INFO', PARTICIPATION_INFO);
        fetchRoomDetails(roomId).then(result => {
            renderRoomDetailsSection(ROOM_INFO);
        });
    });
}

/**
 * Event handler when a new participant joins the current room
 * @typedef {import('./store').ParticipationInfo} ParticipationInfo
 * @param {ParticipationInfo} participantInfo
 */
async function handleNewParticipantJoin(participantInfo) {
    console.log('user-joined-room', participantInfo);

    if (participantInfo.role === 'AUDIENCE') {
        ROOM_INFO.audience.push(participantInfo);
        const audienceList = document.getElementById('audience');
        displayParticipant(audienceList, participantInfo);

    } else {
        ROOM_INFO.panel.push(participantInfo);
        const panelMembersList = document.getElementById('panel-members');
        displayParticipant(panelMembersList, participantInfo);
    }
}

/**
 * Event handler when a participant in the room leaves
 * @param {ParticipationInfo} participantInfo
 */
async function handleParticipantLeave(participantInfo) {
    console.log('user-left-room', participantInfo);
    if (participantInfo.role === 'AUDIENCE') {
        ROOM_INFO.audience = ROOM_INFO.audience.filter(obj => obj.user_id !== participantInfo.user_id);
    } else {
        ROOM_INFO.panel = ROOM_INFO.panel.filter(obj => obj.user_id !== participantInfo.user_id);
    }

    removeParticipantNode(participantInfo);
}

function leaveRoom(e) {
    if (PARTICIPATION_INFO.user_id) {
        socket.emit('user-left-room', PARTICIPATION_INFO);
        closeConnections();
        updateParticipationInfo(null);
        resetRoomDetails();
        unselectRoomNodes();
    }
}
