const db = require('../models/participants');

function initialize(server) {
	// Creating a new socket.io instance by passing the HTTP server object
	const io = require('socket.io')(server);

    io.on('connection', (socket) => { // Listen on the 'connection' event for incoming sockets
		console.log('A user just connected');

        socket.on('user-joined-room', async (eventInfo, callback) => {
            socket.join(eventInfo.roomId);

            const participant = await db.addParticipant({
                room_id: eventInfo.roomId,
                user_id: eventInfo.user.id,
                role: 'SPEAKER',
                peer_id: eventInfo.peer_id,
            });

            participant.name = eventInfo.user.name;

            socket.to(participant.room_id).emit('user-joined-room', participant);
            callback(participant);
        });

        socket.on('user-left-room', async (eventInfo) => {
            socket.leave(eventInfo.room_id);

            let roomParticipant;
            if (eventInfo.role !== 'HOST') {
                roomParticipant = await db.removeParticipant(eventInfo.room_id, eventInfo.user_id);
            } else {
                roomParticipant = await db.updateParticipant(eventInfo.room_id, eventInfo.user_id, null); 
            }

            socket.to(eventInfo.room_id).emit('user-left-room', roomParticipant);
        });
    });

}

module.exports = {
    initialize,
}
