var mysql = require('mysql');


// local Application initialization

//var dbConfig = {
//    host     : 'localhost',
//    user     : 'root',
//    password : '',
//    port     : 3306,
//    database : 'hopster'
//};


//on server db
var dbConfig = {
    host     : 'us-cdbr-iron-east-02.cleardb.net',
    user     : 'b5d30d726262d9',
    password : '7abc1f81',
    database : 'heroku_e20395081287bb0'
}

var connection = mysql.createConnection(dbConfig);

/////////////////// USERS

exports.checkForUser = function (email, password, callback) {
    var query = 'SELECT fName, lName, userID FROM Users WHERE email = "' + email + '" AND password = "' + password + '";';
    connection.query(query,
        function (err, result) {
            if (err) {
                console.log(err);
                return null;
            }
            if (result.length > 0){
                callback(false, result[0]);
            } else {
                callback(false, null);
            }
        }
    );
};

exports.checkForUserWithEmail = function (email, callback) {
    var query = 'SELECT fName, lName, userID FROM Users WHERE email = "' + email + '";';
    connection.query(query,
        function (err, result) {
            if (err) {
                console.log(err);
                return null;
            }
            if (result.length > 0){
                callback(false, result[0]);
            } else {
                callback(false, null);
            }
        }
    );
};

exports.createUser = function (fName, lName, password, email, zipcode, callback){
    var query = 'INSERT INTO Users (fName, lName, password, email, zipcode) values (' +
        '"' + fName + '", "' + lName + '", "' + password + '", "' + email + '", ' + zipcode + ');';
    connection.query(query,
        function (err, result){
            if (err) {
                console.log(err);
                callback(true, err);
            } else {
                callback(false, result);
            }
        }
    );
};

/////// BEERS

exports.getAllBeers = function (callback){
    var query = 'SELECT b.beerID as beerID, b.name as beerName, b.breweryID as breweryID, ' +
            'b.styleID as styleID, b.description as description, b.abv as abv, s.name as styleName, ' +
            'br.name as breweryName, t.tagID as tagID from Beers b join Styles s on b.styleID = s.styleID ' +
            'join Breweries br on br.breweryID = b.breweryID join Tags t on t.beerID = b.beerID;';
    connection.query(query,
        function (err, result){
            if (err) {
                console.log(err);
                callback(true, err);
            } else {
                callback(false, result);
            }
        }
    )
};

////////// PUBS

exports.getAllPubs = function (callback) {
    connection.query('SELECT * FROM Pubs;',
        function (err, result){
            if (err){
                console.log(err);
                return callback(true, err);
            }

            return callback(false, result);
        }
    );
}


////////// TAGS

exports.addUserFollowsTag = function (userID, tagID, callback) {
    var query = 'INSERT INTO UserFollowsTag (tagID, userID) values (' + tagID + ', ' + userID + ');';

    connection.query(query, function (err, result) {
        if (err){
            console.log(err);
            return callback(true);
        }

        return callback(false, result);
    })
}

exports.createTagForNewUser = function (userID, callback) {
    var query = 'INSERT INTO Tags (userID) values (' + userID + ');';

    connection.query(query, function (err, result){
        if (err){
            console.log(err);
            return callback(true);
        }

        return callback(false, result);
    });

};

exports.getTagForUser = function (userID, callback) {
    var query = 'SELECT tagID FROM Tags where userID = ' + userID + ';';
    connection.query(query,
        function (err, result) {
            if(err){
                console.log(err);
                return callback(true);
            }
            return callback (false, result[0].tagID);
        }
    );
}

exports.setTagForUser = function (userID, tagID, callback) {
    var query = 'UPDATE Users SET tagID = ' + tagID + ' where userID = ' + userID + ';'
    connection.query(query,
        function (err, result){
            if (err) {
                console.log(err);
                if (callback){
                    return callback (true, err);
                } else {
                    return;
                }
            }

            if (callback) {
                return callback(false, result);
            }
        }
    );
}

exports.getAllFollowTagsForUser = function (userID, callback){
    var query = "SELECT tagID FROM UserFollowsTag where userID = " + userID + ';';
    connection.query(query,
        function (err, result) {
            if(err){
                console.log(err);
                return callback(true);
            }

            var tags = [];

            for (var i = 0; i < result.length; i++){
                tags.push(result[i].tagID);
            }
            return callback (false, tags);
        }
    );
};

exports.getAllPostIDsForTags = function (tags, callback){
    if (tags.length == 0){
        return callback(false, []);
    }

    var arrayTags = '';

    for (var i = 0; i < tags.length; i++){
        if (i == 0){
            arrayTags += '(';
        }

        arrayTags += ', '
        arrayTags += tags[i];

        if (i == tags.length - 1){
            arrayTags += ')';
        }

    }

    var query = 'SELECT postID FROM PostTags where tagID in ' + arrayTags + ';';

    connection.query(query,
        function (err, result) {
            if (err){
                console.log(err);
                return callback(true, err);
            }

            return callback (false, result);
        }
    );
}

exports.getAllPostsForPostIDs = function (postIDs, callback) {
    var arrayTags = '';

    for (var i = 0; i < postIDs.length; i++){
        if (i == 0){
            arrayTags += '(';
        }

        arrayTags += ', '
        arrayTags += postIDs[i];

        if (i == postIDs.length - 1){
            arrayTags += ')';
        }

    }

    var query = '';

    if (postIDs.length == 0){
        query = 'SELECT date_format(postedAt, "%e %b %Y") as postedAt, p.postID as postID, p.comment as comment, ifnull(p.beerID, "NULL") as beerID, ifnull(b.name, "NULL") as beerName, ifnull(p.pubID, "NULL") as pubID, ifnull(Pubs.name, "NULL") as pubName, u.userID as userID, u.fName as fName, u.lName as lName FROM Posts p left join Beers b on b.beerID = p.beerID left join Pubs on p.pubID = Pubs.pubID join Users u on u.userID = p.userID;';

    } else {
        query = 'SELECT * FROM Posts where postID in ' + arrayTags + ';';
    }

    connection.query(query,
        function (err, result) {
            if (err){
                console.log(err);
                return callback(true, err);
            }

            return callback (false, result);
        }
    );

};

exports.addTagForPost = function (postID, tagID) {
    var query = 'INSERT INTO PostTags (postID, tagID) values (' + postID + ', ' + tagID + ');';
    connection.query(query,
        function(err, result){
            if (err){
                console.log(err);
            }
        }
    );
};

//////// POSTS

exports.postNewPost = function (userID, comment, beerID, pubID, callback) {
    if (!beerID){
        beerID = 'NULL';
    }

    if(!pubID){
        pubID = 'NULL';
    }

    var query = 'INSERT INTO Posts (userID, comment, beerID, pubID) values ('
        + userID + ', "' + comment + '", ' + beerID + ', ' + pubID +');';

    console.log('query: ' + query);
    connection.query(query,
        function (err, result){
            if (err){
                console.log(err);
                return callback(true, err);
            }

            console.log('db result: ' + result.insertId);
            return callback(false, result);

        }
    );
};

handleDisconnect();

function handleDisconnect() {
    connection = mysql.createConnection(dbConfig); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    //console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}