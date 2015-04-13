var mysql = require('mysql');


// local Application initialization

var dbConfig = {
    host     : 'localhost',
    user     : 'root',
    password : '',
    port     : 3306,   
    database : 'hopster'
};


 // on server db
//var dbConfig = {
//    host     : 'us-cdbr-iron-east-01.cleardb.net',
//    user     : 'b7e5e75776c034',
//    password : '83551f85',
//    database : 'heroku_ea0abd6d490b9c8'
//}

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
            'br.name as breweryName from Beers b join Styles s on b.styleID = s.styleID join Breweries br on br.breweryID = b.breweryID;';
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