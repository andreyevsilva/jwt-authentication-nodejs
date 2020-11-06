const { Router } = require('express');
const express = require('express');
const auth = require('./auth');
const projects = require('./projects');

const routes = express.Router();

routes.use('/auth',auth);//auth

routes.use('/api/projects',projects);

module.exports = routes;
