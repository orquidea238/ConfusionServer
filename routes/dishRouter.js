const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

// J'importe le schema dishes
const Dishes = require('../models/dishes');

// Je crée ma route dishRouter:
const dishRouter = express.Router();

// J'utilise le module de traitement du corps de la requete body-parser:
dishRouter.use(bodyParser.json());


// dishes route-----------------------------------------------------------------
dishRouter.route('/')
.get((req, res, next) =>{
    // on trouve tous les dishes et on recupere la reponse en format json
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
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
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403;
    res.send('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Dishes.deleteMany({})
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


// dishId Routes-----------------------------------------------------------
dishRouter.route('/:dishId')
.get((req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);  
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);  
    }, (err) => next(err))
    .catch((err) => next(err));
});


// dishId/comments route------------------------------------------------------------
dishRouter.route('/:dishId/comments')
.get((req, res, next) =>{
    // On récupere un Id dish spécifique
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) =>{
        // Si le dish existe (s'il n'est pas null):
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            // j'affiche tous les commentaires de la dish:
            res.json(dish.coments);
        } 
        else {
            // si dish = null (il n'existe pas), je crée un erreur
            err = new Error('Dish ' + req.params.dishId + ' not found!');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) =>{
    // Je récupere la dish spécifique par son ID
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        // si la dish existe j'insére les infos invoyés (dans req.body) dans les commentaires de la dish:
        if(dish != null){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            // J'inregistre les modifications:
            dish.save()
            .then((dish) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        // Si la dish existe bien:
        if(dish != null){
        // Je supprime toutes les commentaires de la dish selectionnée:
        for(var i = (dish.comments.lenght - 1); i >= 0; i--){
            dish.comments.id(dish.coments[i]._id).remove();
        }
        dish.save()
        .then((dish) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => next(err));
        }
        // Si la dish n'existe pas:
        else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

// dishId/comments/commentId route-----------------------------------------------------------
dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) =>{
        // Si la dish existe bien et le commentaireId existe bien (n'est pas null):
        if (dish != null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            // Je récuper la réponse en format json et on recupere le commentaire par son id:
            res.json(dish.comments.id(req.params.commentId));  
        }  
        // Si la dish n'existe pas:
        else if(dish == null){
            // On crée un msg d'erreur
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else{
            // sinon si la dish n'a pas de commentaires:
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser, (req, res, next) =>{
    if(req.user._id == req.author._id){
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        // Si la dish existe bien et le commentaireId existe bien (n'est pas null):
        if(dish != null && dish.comments.id(req.params.commentId) != null && dish.comments.id(req.params.commentId).author.equals(req.user._id)) {
            // si dans le body de la requete rating existe bien: 
            if(req.body.rating){
            // on prends le ranting dans le commentaire et on le change par le rating dans le body de la requete:
            dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            // si dans le body de la requete comment existe bien:
            if(req.body.comment){
            // on prends le commentaireId et on le change par le comment dans le body de la requete:
            dish.comment.id(req.params.commentId).comment = req.body.comment;
            }
            // On enregistre les changements:
            dish.save()
            .then((dish) =>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    // on affiche tt les dishes:
                    res.json(dish);
                })    
            }, (err) => next(err));
        }

        // Sinon si la dishe n'existe pas:
        else if(dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        // Sinon si c le commentaire qui n'existe pas:
        else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    
}
    else{
        err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
})

.delete(authenticate.verifyUser, (req, res, next) =>{
    if(req.user._id == req.author._id){
    // Je récupere la dish spécifique par son ID
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        // Si la dish existe bien et le commentaireId existe bien (n'est pas null):
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })                    
            }, (err) => next(err));
        }

        // Sinon si la dishe n'existe pas:
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        // Sinon si c le commentaire qui n'existe pas:
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));

} else {
    err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
}
});
 

module.exports = dishRouter;

// .put(authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(req.params.dishId)
//       .then(
//         dish => {
//           const sameUser =
//             JSON.stringify(req.user._id) ==
//             JSON.stringify(dish.comments.id(req.params.commentId).author)
//               ? true
//               : false;

//           if (!sameUser) {
//             err = new Error("You are not authorized to update this comment");
//             res.statusCode = 403;
//             return next(err);
//           } else {
//             if (
//               dish != null &&
//               dish.comments.id(req.params.commentId) != null
//             ) {
//               if (req.body.rating) {
//                 dish.comments.id(req.params.commentId).rating = req.body.rating;
//               }
//               if (req.body.comment) {
//                 dish.comments.id(req.params.commentId).comment =
//                   req.body.comment;
//               }
//               dish.save().then(
//                 dish => {
//                   Dishes.findById(dish._id)
//                     .populate("comments.author")
//                     .then(dish => {
//                       res.statusCode = 200;
//                       res.setHeader("Content-Type", "application/json");
//                       res.json(dish.comments.id(req.params.commentId));
//                     });
//                 },
//                 err => next(err)
//               );
//             } else if (dish == null) {
//               err = new Error("Dish " + req.params.dishId + " not existing");
//               res.statusCode = 404;
//               return next(err);
//             } else {
//               err = new Error(
//                 "Comment " + req.params.commentId + " not existing"
//               );
//               res.statusCode = 404;
//               return next(err);
//             }
//           }
//         },
//         err => next(err)
//       )
//       .catch(err => next(err));
//   })
//   .delete(authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(req.params.dishId)
//       .then(
//         dish => {
//           // checking if the user requesting the comment is the same of the author
//           const sameUser =
//             JSON.stringify(req.user._id) ==
//             JSON.stringify(dish.comments.id(req.params.commentId).author)
//               ? true
//               : false;

//           if (!sameUser) {
//             err = new Error("You are not authorized to delete this comment");
//             res.statusCode = 403;
//             return next(err);
//           } else {
//             if (
//               dish != null &&
//               dish.comments.id(req.params.commentId) != null
//             ) {
//               dish.comments.id(req.params.commentId).remove();
//               dish.save().then(
//                 dish => {
//                   Dishes.findById(dish._id)
//                     .populate("comments.author")
//                     .then(dish => {
//                       res.statusCode = 200;
//                       res.setHeader("Content-Type", "application/json");
//                       res.json(dish.comments.id(req.params.commentId));
//                     });
//                 },
//                 err => next(err)
//               );
//             } else if (dish == null) {
//               err = new Error("Dish " + req.params.dishId + " not existing");
//               res.statusCode = 404;
//               return next(err);
//             } else {
//               err = new Error(
//                 "Comment " + req.params.commentId + " not existing"
//               );
//               res.statusCode = 404;
//               return next(err);
//             }
//           }
//         },
//         err => next(err)
//       )
//       .catch(err => next(err));
//   });