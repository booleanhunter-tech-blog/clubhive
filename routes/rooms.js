const express = require('express');
const router = express.Router();

const db = require('../models');

router.get('/:roomId', async function(req, res, next) {
    
    const room = await db.getRoomDetails(req.params.roomId);
    
    if (room) {
        res.json({
            room: {
                id: room.id,
                name: room.name,
                club_name: room.club_name,
                audience: room.audience ? room.audience : [],
                panel: room.panel ? room.panel : [],
            }
        });
    } else {
        res.status(404).json({
            message: 'Room does not exist'
        });
    }
});

router.get('/', async function(req, res, next) {
    let rooms = [];

    const userId = req.query.userId;
    
    if (req.query.userId) {
        rooms = await db.getRoomsForUser(userId, 100);
    } else {
        rooms = await db.getRooms(100);
    }

    res.json({
        rooms,
    })
});

module.exports = router;
