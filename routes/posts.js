/**
 * Created by connorkuehnle on 4/20/15.
 */

var express = require('express');
var router = express.Router();
var db = require('../models/dataModel.js');
var helpers = require('../helpers.js');


router.post('/newPost', helpers.checkPostParams(['userID', 'tags', 'comment']),
    function (req, res){
        db.postNewPost(req.body.userID, req.body.comment, req.body.beerID, req.body.pubID,
            function(err, result){
                var postID = result.insertId;
                var tags = req.body.tags;
                console.log('tags: ' + tags);
                if (tags.length > 0){
                    for (var i = 0; i < tags.length; i++){
                        console.log('tag: ' + tags[i]);
                        db.addTagForPost(postID, tags[i]);
                    }
                }
                res.send('true');
            }
        );
    }
);

router.get('/postsForUser', helpers.checkGetParams(['userID']),
    function (req, res){
        getPostsforUserID(req.query.userID,
            function (result){
                for (var i = 0; i < result.length; i++){
                    result[i].userName = result[i].fName + ' ' + result[i].lName;
                }
                res.send(JSON.stringify(result));
            }
        );
    }
);



function getPostsforUserID (userID, next) {
    getPostsByTags(userID,
        function (postIDs) {
            db.getAllPostsForPostIDs(postIDs,
                function (err, result){
                    next(result);
                }
            );
        }
    );
}


function getPostsByTags (userID, next){
    getUserFollowsTags(userID,
        function (tags){
            db.getAllPostIDsForTags(tags,
                function(err, postIDs){
                      return next(postIDs);
                }
            );
        }
    );
}

function getUserFollowsTags (userID, next) {
    db.getAllFollowTagsForUser(userID,
        function(err, tags){
            return next(tags);
        }
    );
}





module.exports = router;