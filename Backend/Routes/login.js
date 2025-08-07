const express = require('express');
const router = express.Router();
const { registerNgo, loginNgo } = require("../controllers/ngoController");

router.post('/register', registerNgo);

router.post('/login', loginNgo);

module.exports = router;