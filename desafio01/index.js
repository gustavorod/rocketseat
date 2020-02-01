/*
yarn init
yarn add express
yarn add nodemon -D
*/

const express = require('express');
const server = express();
server.use(express.json());

let projects = [];
let requests = 0;

server.use((req, res, next) => {
    requests++;
    console.time(`Request ${requests}`);
    console.log(`Método: ${req.method}; URL: ${req.url}`);
    next();
    console.timeEnd(`Request ${requests}`);
});

function checkProjectFields(req, res, next){
    const { id, title } = req.body;

    if (!id || !title){
        return res.status(400).json({error: 'ID and title are required.'});
    }

    return next();
}

function checkIDExists(req, res, next){
    const { id } = req.params;
    project = projects.find((project) => project.id == id);

    if (!project){
        return res.status(400).json({error: 'Project ID does not exist.'});
    }

    return next();
}

server.get('/projects',  (req, res) => {
    return res.json(projects);
})

server.post('/projects', checkProjectFields, (req, res) => {
    const project = req.body;
    projects.push(project);

    return res.json(projects);
})

server.put('/projects/:id', checkIDExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    projects.forEach((project) => {
        if (project.id == id){
            project.title = title;
        }
    });

    return res.json(projects);
})

server.delete('/projects/:id', (req, res) => {
    const { id } = req.params;
    
    projects = projects.filter((project) => {
        return !(project.id == id);
    });

    return res.json(projects);
})

server.post('/projects/:id/tasks', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects.forEach((project) => {
        if (project.id == id){

            let tasks = project.tasks || [];
            tasks.push(title);

            project.tasks = tasks;
        }
    });
    
    return res.json(projects);
})

server.listen(3000);