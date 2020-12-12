const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts);
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    // Endpoint to create a new post

    if (!request.body.text && !request.body.media.url) {
        return;
    }

    let params = {
        userId: request.currentUser.id,
        text: request.body.text,
        media: request.body.media
    }

    PostModel.create(params, (rows) => {
        response.status(201).json(rows);
    });

});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post

    let userId = request.currentUser.id;
    let postId = request.params.postId;

    PostModel.like(userId, postId, (rows) => {
        response.status(204).json(rows);
    });                                                                                         
});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post

    let userId = request.currentUser.id;
    let postId = request.params.postId;

    PostModel.unlike(userId, postId, (rows) => {
        response.status(204).json(rows);
    });

});

module.exports = router;
