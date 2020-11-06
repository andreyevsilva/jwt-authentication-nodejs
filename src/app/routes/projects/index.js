const express = require('express');
const routes = express.Router();


const ProjectController = require('../../controller/project');
const auth_middleware = require('../../middlewares/auth');


routes.use(auth_middleware);

const project = new ProjectController();

//List
routes.get('/',project.index);

//Show
routes.get('/:id',project.show);

//Create
routes.post('/',project.create);

//Update
routes.put('/',project.update);

//Delete
routes.delete('/:id',project.delete);


module.exports = routes;