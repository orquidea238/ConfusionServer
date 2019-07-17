const express = require('express');
const bodyParser = require('body-parser');

leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

// leaders Routes---------------------
leaderRouter.route('/')
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) =>{
    res.end('Will send all the leaders to you');
})
.post((req, res, next) =>{
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) =>{
    res.statusCode = 403;
    res.send('PUT operation not supported on /leaders');
})
.delete((req, res, next) =>{
    res.send('Delecting all the leaders!');
})

// leaderId Routes---------------------
leaderRouter.get('/:leaderId', (req, res, next) =>{
    res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!');
});

leaderRouter.post('/:leaderId', (req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId);
});

leaderRouter.put('/:leaderId', (req, res, next) =>{
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
});

leaderRouter.delete('/:leaderId', (req, res, next) =>{
    res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;