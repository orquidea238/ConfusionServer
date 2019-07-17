const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// J'importe le schema dishes
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());


// dishes route-------------------------------------
dishRouter.route('/')
.get((req, res, next) =>{
    // on demande tous les dishes et on recupere la reponse en format json
    Dishes.find({})
    .then((dishes) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) =>{
    // On crée des dishes dans la bdd
    Dishes.create(req.body)
    .then((dish) =>{
        console.log('Dish created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) =>{
    res.statusCode = 403;
    res.send('PUT operation not supported on /dishes');
})
.delete((req, res, next) =>{
    Dishes.deleteMany({})
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


// dishId Routes------------------------------------
dishRouter.route('/:dishId')
.get((req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
})
.put((req, res, next) =>{
    Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);  
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) =>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);  
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;