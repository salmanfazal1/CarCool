var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bcrypt = require('bcryptjs');
var path = require('path');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var session = require('express-session');
var engines = require('consolidate');

//The function to create a new user
function create_user(username, password, password_confirmation, callback) {
    if(password !== password_confirmation) {
        callback('Password does not match confirmation');
    //If the username is already in the users table, don't let this user use it
    } else {
        db.all('SELECT username FROM users WHERE username = ?', [username], function(err, rows) {
            if(rows.length > 0) {
                callback('User already exists');
                return;
            }
            //Otherwise, add the user to the users table
            var pw_hash = bcrypt.hashSync(password, 10);
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, pw_hash], function(err) {
                callback(err, username);
            });
        });
    }
}

var db = new sqlite3.Database('db.sqlite');
db.serialize();

var app = express();

app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.get('/', function (req, res) {
    res.render('index.html');
});

app.post('/signin', function(req, res) {
    var username = req.body.username;
    // Find the user information
    db.all("SELECT username, password, is_admin FROM users WHERE username = ?", [username], function(err, rows) {
        if(err) {
            throw err;
        }
        if(!rows || rows.length > 1) {
            throw "this shouldn't happen";
        }
        // If the row matches the username and password entered, change the session info
        if(rows.length === 1 && bcrypt.compareSync(req.body.password, rows[0].password)) {
            req.session.username = rows[0].username;
            req.session.is_admin = rows[0].is_admin === 1;
            res.redirect('/');
        // Otherwise, send an error back
        } else {
            res.render('index.html', { error: 'Invalid username or password' });
        }
    });
});

// Destroy session info when user logs out
app.get('/signout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.get('/signup', function(req, res) {
    if(req.session.username !== undefined) {
        res.redirect('/');
        return;
    }
});

app.post('/signup', function(req, res) {
    // Don't let a user sign up if they are already signed in
    if(req.session.username !== undefined) {
        res.redirect('/');
        return;
    }
    // Otherwise, create a user using the function above
    var username = req.body.username;
    var password = req.body.password;
    var password_confirmation = req.body.password_confirmation;

    create_user(username, password, password_confirmation, function(err, username) {
        if (err) {
            res.render('index.html', {error: err});
        } else {
            req.session.username = username;
            res.redirect('/');  
        }
    });
});

// Query for users to change their password
app.post('/modpass', function(req, res) {
    db.run('UPDATE users SET password = ? WHERE username = ?', [req.body.password, req.session.username], function(err) {
        callback(err, req.session.username);
    });
});

// Query for users to add a credit/debit card to their account
app.post('/addcard', function(req, res) {
    db.run('INSERT INTO payment VALUES (?, ?, ?, ?)', [req.session.username, req.body.card_number, req.body.security, req.body.expiration], function(err) {
        callback(err, req.session.username);
    });
});

// Getting the payment information when a user is ready to pay
app.get('/payment', function(req, res) {
    db.all('SELECT * FROM payment WHERE username = ?', [req.session.username], function(err, rows) {
        // If this returns nothing, the user has not added any cards
        if(rows.length == 0) {
            callback('You have no cards associated with your account');
            return;
        }
        // Otherwise, return all cards
        var cards = rows.map(function(row) {
            return row;
        });

        res.json(cards);
    });
});

// Not sure how we're getting the cooler's username when the ruler says they got the car back
app.post('/carreturn', function(req, res) {
    db.run('INSERT INTO exchange VALUES(?, ?)', [cooler, req.session.username], function(err) {
        callback(err, req.session.username);
    });
});

// Not sure how we're getting the username of the person being rated
app.post('/rate', function(req, res) {
    db.run('INSERT INTO total_ratings VALUES (?, ?, ?, ?)', [username, req.body.rating, req.body.recommend, req.body.comment], function(err) {
        callback(err, username);
    });
    // If a user has been rated, update the ratings_per_user table so the new average rating/recommend is recorded
    db.all('SELECT username, avg(rating) AS rating, (100*sum(recommend))/count(*) AS recommend FROM total_ratings WHERE username = ?', [username], function(err, rows) {
        if (rows.length > 0) {
            db.all('SELECT * FROM ratings_per_user WHERE username = ?', [username], function(err, check_rows) {
                if (check_rows.length > 0) {
                    db.run('UPDATE ratings_per_user SET rating = ?, recommend = ? WHERE username = ?', [rows[0].rating, rows[0].recommend, username], function(err) {
                        callback(err, username);
                    });
                }
                // If this is the first rating, this is the average rating/recommend so just add this to ratings_per_user
                else {
                    db.run('INSERT INTO ratings_per_user VALUES (?, ?, ?)', [username, rows[0].rating, rows[0].recommend], function(err) {
                        callback(err, username);
                    });
                }
            });
        }
    });
});

// Not sure how we're getting the username of the profile being viewed
app.get('/profile', function(req, res) {
    db.all('SELECT * FROM ratings_per_user WHERE username = ?', [username], function(err, rows) {
        var ratings = rows.map(function(row) {
            return row;
        })

        res.json(ratings);
    });
    db.all('SELECT * FROM total_ratings WHERE username = ?', [username], function(err, rows) {
        var comments = rows.map(function(row) {
            if (row.comment !== null) {
                if (row.username === null) {
                    // Give an optional anonymous button when users are rating
                    row.username = 'Anonymous';
                }
                return row;

            }
        })

        // This contains the comment, rating, and recommend that each user added
        res.json(comments);
    });
});

// Add a listing for a user
app.post('/addlisting', function(req, res) {
    db.run('INSERT INTO listings VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.session.username, req.body.model, req.body.make, req.body.license, req.body.seats, req.body.ac, req.body.auto, req.body.price], function(err) {
        callback(err, username);
    });
    // Use the google maps api to change the address to latitude and longitude (to use later)
    var adr = req.body.address;
    var geocoder = new google.maps.Geocoder();
    var address = adr;

    geocoder.geocode( { 'address': address}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            var latlng = "(" + latitude + "," + longitude + ")";
            db.run('INSERT INTO rulers VALUES (?, ?, ?)', [req.session.username, latlng, adr], function(err) {
                callback(err, req.session.username);
            });
        } 
    }); 

// This function returns the distance between two latitude/longitude points
function dist(lat1, lng1, lat2, lng2) {
    var distance = acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lng1 - lng2));
    return 6371 * distance;
}

// Gets the listings for a user based on rating and location
app.get('/listings', function(req, res){
    var distance = req.body.distance;
    var e_radius = 6371;
    var adr = req.body.address;
    var geocoder = new google.maps.Geocoder();
    var address = adr;
    // Use the google maps api to change the searching user's location to latitude and longitude
    // and find listings within their specified max distance
    geocoder.geocode( { 'address': address}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
        }
    });
    var maxlat = latitude + ((distance/e_radius) * Math.PI / 180);
    var minlat = latitude - ((distance/e_radius) * Math.PI / 180);
    var maxlng = longitude + ((distance/e_radius) * Math.PI / 180);
    var minlng = longitude - ((distance/e_radius) * Math.PI / 180);
    
    // Find all users within the square distance as above
    db.run('SELECT * FROM rulers JOIN ratings_per_user ON rulers.username=ratings_per_user.username WHERE username != ? AND location.x >= ? AND location.x <= ? AND location.y >= ? AND location.y <= ? ORDER BY ratings_per_user.rating, ratings_per_user.recommend', [req.session.username, minlat, maxlat, minlng, maxlng], function(err, rows) {
        var listings = rows.map(function(row) {
            // If there were no cars within the distance, tell the user
            if (row.length === 0) {
                callback('No cars found within the given distance. Please try again.');
            } else {
                var x = 0;
                // If this car is within a circle radius, return it and update x so we know
                // That at least one listing was found
                if (dist(latitude, longitude, row.location.x, row.location.y) < distance) {
                    return row;
                    x = x + 1;
                }
            }
            // If no listing was found, tell the user
            if (x == 0) {
                callback('No cars found within the given distance. Please try again.');
            }
        });
        res.json(listings);
    });
});

//to update a listing (same username problem)(working on updating just the fields that were changed)
app.put('/modlist', function(req, res){
    //db.run('UPDATE listings SET' 
    });
});

//delete listing 

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//db.close();
