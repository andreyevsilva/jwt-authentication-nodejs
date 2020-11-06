const Project = require('../model/project');
const Task = require('../model/task');

class ProjectController {

    async index(req, res) {
        try {
            const projects = await Project.find().populate(['user', 'tasks']);

            return res.status(200).send({ projects });
        } catch (error) {
            return res.status(400).send({ error: 'Error loading projects: ' + error })
        }
    }

    async show(req, res) {
        try {
            const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

            return res.status(200).send({ project });
        } catch (error) {
            return res.status(400).send({ error: 'Error loading project: ' + error })
        }
    }

    async create(req, res) {
        const { title, description, tasks } = req.body;

        try {
            const project = await Project.create({ title, description, user: req.user_id });

            await Promise.all(tasks.map(async task => {
                const projectTask = new Task({ ...task, project: project._id });

                await projectTask.save();

                project.tasks.push(projectTask)

            }));

            await project.save();

            return res.status(201).send({ message: 'Project created.' });
        } catch (error) {
            return res.status(400).send({ error: 'Error to create a new project: ' + error })
        }

    }

    async update(req, res) {
        const { title, description, tasks } = req.body;

        try {
            const project = await Project.findByIdAndUpdate(req.query.id, 
                { title, 
                  description 
                }, { 
                    new: true 
                });
            
            project.tasks = [];
            
            await Task.remove({project:project._id});

            await Promise.all(tasks.map(async task => {
                const projectTask = new Task({ ...task, project: project._id });

                await projectTask.save();

                project.tasks.push(projectTask)

            }));

            await project.save();

            return res.status(201).send({ message: 'Project updated.' });
        } catch (error) {
            return res.status(400).send({ error: 'Error to update project: ' + error })
        }

    }

    async delete(req, res) {
        try {
            const project = await Project.findByIdAndRemove(req.params.projectId).populate('user');

            return res.status(200).send({ project });
        } catch (error) {
            return res.status(400).send({ error: 'Error deleting project: ' + error })
        }
    }
}


module.exports = ProjectController;