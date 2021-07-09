import {
    handleRoomSelect,
} from './index.js';

import {
    peer,
} from './webrtc.js';

import {
    PARTICIPATION_INFO,
    USER_INFO,
} from './store.js';

/**
 * Save details about the current participation info
 * @typedef {import('./store').Room} Room
 * @param {Room[]} rooms
 */
export function renderRooms(rooms) {
    console.log(rooms);
    const roomList = document.getElementById('room-list');

    for (let i=0; i<rooms.length; i++) {
        roomList.appendChild(createRoomNode(rooms[i]));
    }
}

/**
 * Creates a single room card and returns it as a list element
 * @param {Room} room
 */
function createRoomNode(room) {
    const roomItem = document.createElement('li');
    roomItem.setAttribute('data-id', room.id);

    const roomCard = document.createElement('div');
    roomCard.className = 'room-card';
    roomCard.setAttribute('data-id', room.id);
    roomCard.tabIndex = 0;
    roomItem.appendChild(roomCard);

    if (room.club_name) {
        const clubName = document.createElement('div');
        clubName.className = 'club-name';
        clubName.textContent = room.club_name;
        roomCard.appendChild(clubName);
    }

    const roomName = document.createElement('div');
    roomName.className = 'room-name';
    roomName.textContent = room.name;
    roomCard.appendChild(roomName);

    const panelMembers = document.createElement('ul');
    panelMembers.className = 'panel-members';
    for (let i=0; i < room.panel.length; i++) {
        const panelMember = document.createElement('li');
        panelMember.textContent = room.panel[i].name;
        panelMembers.appendChild(panelMember);
    }
    roomCard.appendChild(panelMembers);

    const countContainer = document.createElement('div');
    countContainer.className = 'count';

    const participantCount = document.createElement('span');
    participantCount.className = 'participants';
    participantCount.textContent = room.participant_count;
    countContainer.appendChild(participantCount);

    const panelCount = document.createElement('span');
    panelCount.className = 'panel';
    panelCount.textContent = room.panel_count;
    countContainer.appendChild(panelCount);


    roomCard.appendChild(countContainer);

    roomCard.addEventListener('click', handleRoomSelect);

    return roomItem;
}

/**
 * Highlight a room card when it is selected
 * @param {Element} element
 */
export function selectRoomNode(element) {
    unselectRoomNodes();
    element.className = `${element.className} selected`;
}

/**
 * Remove style when a room is unselected
 */
export function unselectRoomNodes() {
    const selectedRooms = document.getElementsByClassName('room-card selected');
    for (let i=0; i<selectedRooms.length; i++) {
        selectedRooms[i].className = selectedRooms[i].className.replace(/selected/g, '');
    }
}

/**
 * Display room info along with all the participants
 * @typedef {import('./store').RoomInfo} RoomInfo
 * @param {RoomInfo} roomInfo
 */
export function renderRoomDetailsSection(roomInfo) {
    document.getElementById('room-details').style.display = 'block';

    if (roomInfo.club_name) {
        document.getElementById('club-name').textContent = roomInfo.club_name;
    }

    document.getElementById('room-name').textContent = roomInfo.name;


    const panelMembersList = document.getElementById('panel-members');
    for (let i=0; i < roomInfo.panel.length; i++) {
        displayAndConnectWithRoomParticipant(panelMembersList, roomInfo.panel[i]);
    }
    
    if (roomInfo.audience) {
        const audienceList = document.getElementById('audience');
        for (let i=0; i < roomInfo.audience.length; i++) {
            displayAndConnectWithRoomParticipant(audienceList, roomInfo.audience[i]);
        }
    }
}

/**
 * Clears current room info from the DOM
 */
export function resetRoomDetails() {
    document.getElementById('room-details').style.display = 'none';
    document.getElementById('club-name').textContent = '';
    document.getElementById('room-name').textContent = '';
    document.getElementById('panel-members').textContent = '';
    document.getElementById('audience').textContent = '';
}

/**
 * Displays participant in a list item and attempts peer connection for media streaming
 * @typedef {import('./store').ParticipationInfo} ParticipationInfo
 * @param {Element} containerElement
 * @param {ParticipationInfo} participantInfo
 */
async function displayAndConnectWithRoomParticipant(containerElement, participantInfo) {
    if (participantInfo.peer_id) {
        const participant = displayParticipant(containerElement, participantInfo);

        // establish peer connection
        if (participantInfo.user_id.toString() !== USER_INFO.id.toString()) {

            let mediaStream;
            if (PARTICIPATION_INFO.role !== 'AUDIENCE') {
                mediaStream = await openUserMedia();
            } else {
                mediaStream = new MediaStream();
            }

            if (participantInfo.role !== 'AUDIENCE') {

                const participantAudio = createParticipantAudio(participantInfo.user_id)
                participant.appendChild(participantAudio);

                const call = peer.call(participantInfo.peer_id, mediaStream, {metadata: {participantInfo: PARTICIPATION_INFO}});

                call.on('stream', attachAudioStream(participantInfo.user_id, participantAudio));

            } else {
                const call = peer.call(participantInfo.peer_id, mediaStream, {metadata: {participantInfo: PARTICIPATION_INFO}});
            }
        }
    }
}

/**
 * Creates an audio tag for the participant
 * @param {string} userId
 */
export function createParticipantAudio(userId) {
    const participantAudio = document.createElement('audio');
    participantAudio.id = `participant-audio-${userId}`;
    participantAudio.className = 'participant-audio';
    return participantAudio; 
}

/**
 * Displays participant within the container
 * @param {Element} containerElement
 * @param {ParticipationInfo} participantInfo
 */
export function displayParticipant(containerElement, participantInfo) {
    const participant = document.createElement('li');
    participant.id = `participant-${participantInfo.user_id}`;
    participant.className = 'participant';
    containerElement.appendChild(participant);

    const span = document.createElement('span');
    participant.appendChild(span);
    span.textContent = participantInfo.name;

    return participant;
}

/**
 * Returns function that attaches the audio stream to the participant's audio tag
 * @param {string} participantUserId
 * @param {HTMLAudioElement} participantAudio
 */
export function attachAudioStream(participantUserId, participantAudio) {
    return (userAudioStream) => {
        console.group(`receive audio stream from connected peer - ${participantUserId}`);
        participantAudio.srcObject = userAudioStream;
        participantAudio.addEventListener('loadedmetadata', () => {
            participantAudio.play();
        });
    }
}

/**
 * Removes participant from the UI
 * @param {ParticipationInfo} participantInfo
 */
export function removeParticipantNode(participantInfo) {
    const participant = document.getElementById(`participant-${participantInfo.user_id}`);
    participant.parentNode.removeChild(participant);
}

/**
 * Gets user audio stream from a media input device
 */
export async function openUserMedia(e) {
    const stream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});
    return stream;
}
