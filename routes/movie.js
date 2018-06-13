const express = require('express');
const auth = require('../middleware/authentication');
const authManager = require('../middleware/authenticationManager');
const database = require('../database');
const { validate } = require('../models/movie');

const router = express.Router();

module.exports = router;