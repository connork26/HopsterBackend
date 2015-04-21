/**
 * Created by connorkuehnle on 4/20/15.
 */

var express = require('express');
var router = express.Router();
var db = require('../models/dataModel.js');
var helpers = require('../helpers.js');

router.get('/postsForUser', helpers.checkGetParams(['userID']),
    function (req, res){
        getPostsforUserID(req.query.userID,
            function (result){
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