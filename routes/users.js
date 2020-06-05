const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');


router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.post('/events/:id', passport.checkAuthentication, usersController.event);

router.get('/signup', usersController.signUp);
router.get('/signin', usersController.signIn);

router.post('/create', usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: 'back'},
), usersController.createSession);

router.get('/signout', usersController.destroySession);

// google oauth routes
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: 'users/signin'}), usersController.createSession);


// Ask Password reset
router.get('/ask-password-reset', usersController.askResetPassword);
router.post('/password-reset-request', usersController.createPasswordResetRequest);
router.get('/reset-password/:id', usersController.showPasswordResetForm);
router.post('/new-password/:id', usersController.setNewPassword);


module.exports = router;