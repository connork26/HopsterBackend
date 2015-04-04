/**
 * Created by connorkuehnle on 4/2/15.
 */

module.exports = {
    checkGetParams: function (arr) {
        return function (req, res, next) {
            // Make sure each param listed in arr is present in req.query
            var missing_params = [];
            for (var i = 0; i < arr.length; i++) {
                if (!eval("req.query." + arr[i])) {
                    missing_params.push(arr[i]);
                }
            }
            if (missing_params.length == 0) {
                next();
            } else {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    "error": "query error",
                    "message": "Parameter(s) missing: " + missing_params.join(", ")
                }));
            }
        }
    },

    checkPostParams: function (arr) {
        return function (req, res, next) {
            // Make sure each param listed in arr is present in req.query
            var missing_params = [];
            for (var i = 0; i < arr.length; i++) {
                if (!eval("req.body." + arr[i])) {
                    missing_params.push(arr[i]);
                }
            }
            if (missing_params.length == 0) {
                next();
            } else {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    "error": "query error",
                    "message": "Parameter(s) missing: " + missing_params.join(", ")
                }));
            }
        }
    }
}