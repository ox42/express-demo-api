const router = require('express').Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');

router.get('/', asyncMiddleware(async function (req, res, next) {

    res.send('Hello there...');
}));

module.exports = router;
