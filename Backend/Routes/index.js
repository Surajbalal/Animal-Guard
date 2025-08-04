const express = require('express');
const { registerNgo } = require('../controllers/ngoController');

const router = express.Router();

const loginRouter = require('./login'); // make sure this exports a router


router.use('/ngo', loginRouter);

// router.post('/register', registerNgo);

module.exports = router;
