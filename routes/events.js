const express = require('express');
const router = express.Router();
const passport = require('passport');

const eventController = require('../controllers/events_controller');

router.post('/create', passport.checkAuthentication, eventController.create);
router.get('/delete/:id', passport.checkAuthentication, eventController.destroy);

module.exports = router;