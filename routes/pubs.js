/**
 * Created by connorkuehnle on 4/9/15.
 */

var express = require('express');
var router = express.Router();
var db = require('../models/dataModel.js');
var helpers = require('../helpers.js');


router.get('/allPubs', function (req, res, next) {
    db.getAllPubs(
        function (err, result){
            if (err){
                return res.send('Error');
            }

            return res.send(JSON.stringify(result));
        }
    );
});


module.exports = router;
