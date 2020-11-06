const express = require('express');
const AuthController = require('../../controller/auth');

const routes = express.Router();

const auth = new AuthController();

routes.post('/login',auth.login);
routes.post('/register',auth.registration);
routes.post('/forgot_password',auth.forgotPassword);
routes.post('/reset_password',auth.resetPassword);

module.exports = routes;