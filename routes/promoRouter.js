const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

promoRouter = express.Router();
promoRouter.use(bodyParser.json());

// Promotions Routes-----------------------------------------
promoRouter.route('/')
.get((req, res, next) =>{
    Promotions.find({})
    .then((promotions) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) =>{
    Promotions.create(req.body)
    .then((promo) =>{
        console.log('Promo created ', promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) =>{
    res.statusCode = 403;
    res.send('PUT operation not supported on /promotions');
})
.delete((req, res, next) =>{
    Promotions.deleteMany({})
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})


// promoId Routes------------------------------------------------------
promoRouter.route('/:promoId')
.get((req, res, next) =>{
    Promotions.findById(req.params.promoId)
    .then((promo) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promoId);
})
.put((req, res, next) =>{
    Promotions.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true })
    .then((promo) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) =>{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = promoRouter;