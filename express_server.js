var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bcrypt = require('bcryptjs');
var path = require('path');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var session = require('express-session')

function create_user(username, password, password_confirmation, callback) {
    if(password !== password_confirmation) {
        callback('Password does not match confirmation');
    } else {
        db.all('SELECT username FROM users WHERE username = ?', [username], function(err, rows) {
            if(rows.length > 0) {
                callback('User already exists');
                return;
            }

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
nunjucks.configure('views', { autoescape: true, express: app });

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(session({ secret: '', resave: false, saveUninitialized: false }));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.get('/', function (req, res) {
  res.render('index.html');
});

app.post('/signin', function(req, res) {
    var username = req.body.username;

    db.all("SELECT username, password, is_admin FROM users WHERE username = ?", [username], function(err, rows) {
        if(err) {
            throw err;
        }
        if(!rows || rows.length > 1) {
            throw "this shouldn't happen";
        }

        if(rows.length === 1 && bcrypt.compareSync(req.body.password, rows[0].password)) {
            req.session.username = rows[0].username;
            req.session.is_admin = rows[0].is_admin === 1;
            res.redirect('/');
        } else {
            res.render('index.html', { error: 'Invalid username or password' });
        }
    });
});

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
    if(req.session.username !== undefined) {
        res.redirect('/');
        return;
    }

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

app.post('/modpass', function(req, res) {
    db.run('UPDATE users SET password = ? WHERE username = ?', [req.body.password, req.session.username], function(err) {
        callback(err, req.session.username);
    });
});

app.post('/addcard', function(req, res) {
    db.run('INSERT INTO payment VALUES (?, ?, ?, ?)', [req.session.username, req.body.card_number, req.body.security, req.body.expiration], function(err) {
        callback(err, req.session.username);
    });
});

app.get('/payment', function(req, res) {
    db.all('SELECT * FROM payment WHERE username = ?', [req.session.username], function(err, rows) {
        if(rows.length == 0) {
            callback('You have no cards associated with your account');
            return;
        }
        var cards = rows.map(function(row) {
            return row;
        });

        res.json(cards);
    });
});

app.post('/newlocation', function(req, res) {
    db.run('UPDATE rulers SET location = ? WHERE username = ?', [req.body.new_location, req.session.username], function(err) {
        callback(err, req.session.username);
    });
});

app.post('/addcar', function(req, res) {
    db.run('INSERT INTO rulers VALUES (?, ?)', [req.session.username, req.body.location], function(err) {
        callback(err, req.session.username);
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

    db.all('SELECT username, avg(rating) AS rating, (100*sum(recommend))/count(*) AS recommend FROM total_ratings WHERE username = ?', [username], function(err, rows) {
        if (rows.length > 0) {
            db.all('SELECT * FROM ratings_per_user WHERE username = ?', [username], function(err, check_rows) {
                if (check_rows.length > 0) {
                    db.run('UPDATE ratings_per_user SET rating = ?, recommend = ? WHERE username = ?', [rows[0].rating, rows[0].recommend, username], function(err) {
                        callback(err, username);
                    });
                }
      
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
        }

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
        }

        // This contains the comment, rating, and recommend that each user added
        res.json(comments);
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//db.close();
