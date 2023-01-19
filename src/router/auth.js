const { Router } = require('express');
const passport = require('passport');
const authRouter = Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/wardian');

// Authentication
authRouter.post('/user/auth/create', authController.userAuthCreate);
authRouter.post('/user/auth', authController.userAuthLogin);
authRouter.post('/login', passport.authenticate('login', {
    successRedirect: "/",
    failureRedirect: "/login"
}))

module.exports = authRouter;