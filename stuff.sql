/*
This is for seeing if a user already exists or if the user entered the wrong username or password and will also
sign a user up or sign them in
*/

/*already exists or sign up*/
db.all('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(err, rows) {
    if(rows.length > 0) {
        callback('User already exists');
        return;
    }
    db.run('INSERT INTO users(username, password) VALUES (?, ?)', [username, password], function(err) {
        callback(err, username);
    });
});
/*wrong username/password or sign in*/
db.all('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(err, rows) {
    if(rows.length === 1) {
        req.session.username = rows[0].username;
        req.session.is_admin = rows[0].is_admin === 1;
        res.redirect('/');
    } else {
        res.render('index.html', { error: 'Invalid username or password' });
    }
});


/*
Insert a new rating into the total_ratings table
*/
db.run('INSERT INTO total_ratings VALUES (?, ?, ?, ?)', [r_id, username, rating, recommend], function(err) {
    callback(err, r_id);
});

/*
Update username or password in the users table 
*/
db.run('UPDATE users SET username = ? WHERE username = ?', [new_username, req.session.username], function(err) {
    callback(err, req.session.username);
    req.session.username = new_username;
});

db.run('UPDATE users SET password = ? WHERE username = ?', [password, req.session.username], function(err) {
    callback(err, req.session.username);
});


/*
Insert a new credit/debit card into the payment table (users can have multiple cards)
*/
db.run('INSERT INTO payment VALUES (?, ?, ?, ?)', [req.session.username, card_number, security, expiration], function(err) {
    callback(err, req.session.username);
});

/*
Get all cards associated with one user
*/
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

/*
Change the location of a ruler's car
*/
db.run('UPDATE rulers SET location = ? WHERE username = ?', [new_location, req.session.username], function(err) {
    callback(err, req.session.username);
});

/*
Insert a new ruler into the rulers table (coolers can become rulers also)
*/
db.run('INSERT INTO rulers VALUES (?, ?)', [req.session.username, location], function(err) {
    callback(err, req.session.username);
});

/*
Insert a new exchange into the table
*/
db.run('INSERT INTO exchange VALUES(?, ?, ?)', [ex_id, cooler, req.session.username], function(err) {
    callback(err, req.session.username);
});

/*
Update the rating of a user if a new rating has been added or insert if a user has never been rated
*/

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

/*
Get the username, rating and recommend for a user
*/
db.all('SELECT * FROM ratings_per_user WHERE username = ?', [username], function(err, rows) {
    var ratings = rows.map(function(row) {
        return row;
    }

    res.json(ratings);
});


/*
Get all car rulers ordered by rating, then by recommend percentage
*/
db.all('SELECT * FROM rulers JOIN ratings_per_user ON rulers.username=ratings_per_user.username WHERE username != ? ORDER BY ratings_per_user.rating, ratings_per_user.recommend', [req.session.username], function(err, rows) {
});
