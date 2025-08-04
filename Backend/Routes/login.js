const express = require('express');
const router = express.Router();
const { registerNgo } = require("../controllers/ngoController");

router.post('/register', registerNgo);
module.exports = router;