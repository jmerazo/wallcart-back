const { Router } = require('express');
const authRouter = Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/wardian');

// Authentication
authRouter.post('/user/auth/create', authController.userAuthCreate);
authRouter.post('/user/auth', authController.userAuthLogin);

module.exports = authRouter;