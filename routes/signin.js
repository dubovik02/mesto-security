const router = require('express').Router();

const { login } = require('../controllers/signin');

router.post('/', login);

module.exports = router;
