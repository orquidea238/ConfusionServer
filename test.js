//task 1 
//exports.verifyAdmin = function(req , res , next){
//     if(req.user.admin){
//         next();
//     }
//     else{
//         var err = new Error("You are not authorized to perform this operation!");
//         err.satus = 403;
//         return next(err);
//     }
// }


// Exercice coursera get et delete commentId dans le fichier dishRouter.js
// router.put(authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(req.params.dishId)
//     .then((dish) => {
//         if (dish != null && dish.comments.id(req.params.commentId) != null 
//             && dish.comments.id(req.params.commentId).author.equals(req.user._id)) {
//             if (req.body.rating) {
//                 dish.comments.id(req.params.commentId).rating = req.body.rating;
//             }
//             if (req.body.comment) {
//                 dish.comments.id(req.params.commentId).comment = req.body.comment;                
//             }
//             dish.save()
//             .then((dish) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(dish);                
//             }, (err) => next(err));
//         }
//         else if (dish == null) {
//             err = new Error('Dish ' + req.params.dishId + ' is invalid');
//             err.status = 404;
//             return next(err);
//         }
//         else if (dish.comments.id(req.params.commentId) == null) {
//             err = new Error('Comment ' + req.params.commentId + ' is invalid');
//             err.status = 404;
//             return next(err);            
//         }
//         else {
//             err = new Error('you are not authorized to update this comment!');
//             err.status = 401;
//             return next(err);  
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .delete(authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(req.params.dishId)
//     .then((dish) => {
//         if (dish != null && dish.comments.id(req.params.commentId) != null
//             && dish.comments.id(req.params.commentId).author.equals(req.user._id)) {
//             dish.comments.id(req.params.commentId).remove();
//             dish.save()
//             .then((dish) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(dish);                
//             }, (err) => next(err));
//         }
//         else if (dish == null) {
//             err = new Error('Dish ' + req.params.dishId + ' is invalid');
//             err.status = 404;
//             return next(err);
//         }
//         else if (dish.comments.id(req.params.commentId) == null) {
//             err = new Error('Comment ' + req.params.commentId + ' is invalid');
//             err.status = 404;
//             return next(err);            
//         }
//         else {
//             err = new Error('you are not authorized to delete this comment!');
//             err.status = 401;
//             return next(err);  
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });