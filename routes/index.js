const express = require('express');

const router = express.Router();
const homeContoller = require('../controllers/home_controller');


console.log('router loaded');

router.get('/', homeContoller.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/events', require('./events'));
router.use('/likes', require('./likes'));


router.use('/api', require('./api'));


// form any furthur routes, access form here.
// router.use('/routerName', require('./routerFile'));


module.exports = router;