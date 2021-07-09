const express = require('express');
const router = express.Router();

const db = require('../models/users');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const username = req.query.username;

    let userInfo = {};

    if (username) {
        const user = await db.getUserByUsername(username);

        if (user) {
            userInfo = {
                username: user.username,
                name: user.name,
                userId: user.id,
            };
        }
    }

    res.render('index', userInfo);
});

module.exports = router;
