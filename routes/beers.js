/**
 * Created by connorkuehnle on 4/7/15.
 */

var express = require('express');
var router = express.Router();
var db = require('../models/dataModel.js');
var helpers = require('../helpers.js');

router.get('/allBeers', function (req, res, next) {
    db.getAllBeers(
        function (err, result) {
            if(err){

            }
            res.send(JSON.stringify(result));
        }
    )
});







module.exports = router;