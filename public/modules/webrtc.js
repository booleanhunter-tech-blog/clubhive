import {
    openUserMedia,
    createParticipantAudio,
    attachAudioStream,
} from './helpers.js';

import {
    PARTICIPATION_INFO,
    updatePeerId,

} from './store.js';

export const peer = new Peer({
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80),
    path: '/peerjs'
});

peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    updatePeerId(id);
});

peer.on('call', async function(call) {
    const participantUserId = call.metadata.participantInfo.user_id;

    console.info(`call request from ${participantUserId}`);

    // if call requester part of speaker panel, then stream their audio
    if (call.metadata.participantInfo.role !== 'AUDIENCE') {
        const participant = document.getElementById(`participant-${participantUserId}`);
        const participantAudio = createParticipantAudio(participantUserId);
        participant.appendChild(participantAudio);

        call.on('stream', attachAudioStream(participantUserId, participantAudio));
    }

    // if part of speaker panel, send own audio stream
    if (PARTICIPATION_INFO.role !== 'AUDIENCE') {

        const localStream = await openUserMedia();
        console.log('Answer the call');
        call.answer(localStream);
    } else {
        call.answer();
    }
});

/**
 * Closes all peer connections
 */
export function closeConnections() {
    const peerConnections = peer.connections
    for (const peerObject in peerConnections) {
        peerConnections[peerObject].forEach(connection => connection.close());
    }
}

/**
 * Show the list of connected peers
 */
export function getConnections() {
    console.log(peer.connections);
    return peer.connections;
}

peer.on('error', function(err) {
    console.log(err);
});
