--The table containing sign in/authorization info for users
CREATE TABLE users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0
);

--The table containing information on CarRulers' location
CREATE TABLE rulers (
    username TEXT NOT NULL,
    location POINT NOT NULL,
    address TEXT NOT NULL,

    FOREIGN KEY(username) REFERENCES users(username)
);

--The table containing payment information for users
CREATE TABLE payment (
    username TEXT NOT NULL,
    num INTEGER PRIMARY KEY,
    sec_code INTEGER NOT NULL,
    expiry TEXT NOT NULL,

    FOREIGN KEY(username) REFERENCES users(username)
);

--The table containing the usernames of users who have rented/rented out each other's car
CREATE TABLE exchange (
    ex_id INTEGER PRIMARY KEY,
    cooler TEXT NOT NULL,
    ruler TEXT NOT NULL,

    FOREIGN KEY(cooler) REFERENCES users(username),
    FOREIGN KEY(ruler) REFERENCES users(username)
);

--The table containing the ratings, recommendations and comments for each exchange
CREATE TABLE total_ratings (
    r_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    rating INTEGER NOT NULL,
    recommend INTEGER DEFAULT 0,
    comment TEXT,
    rater TEXT,

    FOREIGN KEY(username) REFERENCES users(username),
    FOREIGN KEY(rater) REFERENCES users(username)
);

--The table containing the average rating and recommendation for each user
CREATE TABLE ratings_per_user (
    username TEXT PRIMARY KEY,
    rating INTEGER NOT NULL,
    recommend INTEGER NOT NULL,

    FOREIGN KEY(username) REFERENCES users(username)
);

--The table containing all comments for each user
CREATE TABLE comments (
    c_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    comment TEXT NOT NULL,

    FOREIGN KEY(username) REFERENCES users(username)
);

--The table containing information on each listing made by a CarRuler
CREATE TABLE listings (
    username TEXT NOT NULL,
    car_make TEXT NOT NULL,
    car_model TEXT NOT NULL,
    license_plate TEXT NOT NULL PRIMARY KEY,
    seats INTEGER NOT NULL,
    ac INTEGER DEFAULT 0,
    auto INTEGER DEFAULT 0,
    price INTEGER NOT NULL,
    FOREIGN KEY(username) REFERENCES users(username)
);

--Dummy information to populate the schema
INSERT INTO users(username, password, is_admin) VALUES ("admin_user", "admin123", 1);
INSERT INTO users(username, password) VALUES ("joe", "iamjoe");
INSERT INTO users(username, password) VALUES ("jane", "iamjane");
INSERT INTO users(username, password) VALUES ("bob", "iambob");
INSERT INTO users(username, password) VALUES ("liz", "iamliz");
INSERT INTO users(username, password) VALUES ("jeff", "iamjeff");
INSERT INTO rulers VALUES ("bob", (43.7623623, -79.32097349999998), "1338 York Mills Road, Toronto, Ontario");
INSERT INTO rulers VALUES ("liz", (43.6724412, -79.43021779999998), "1142 Ossington Avenue, Toronto, Ontario");
INSERT INTO rulers VALUES ("jeff", (43.6628297, -79.39588279999998), "15 King's College Circle, Toronto, Ontario");
INSERT INTO payment VALUES ("joe", 123456789, 345, "2811");
INSERT INTO exchange(cooler, ruler) VALUES ("joe", "bob");
INSERT INTO total_ratings(username, rating, recommend, comment, rater) VALUES ("joe", 4, 1, "great", "bob");
INSERT INTO total_ratings(username, rating, recommend, comment, rater) VALUES ("bob", 2, 0, "not the best", "joe");
INSERT INTO ratings_per_user VALUES ("joe", 4, 1);
INSERT INTO ratings_per_user VALUES ("bob", 2, 0);
INSERT INTO comments(username, comment) VALUES ("joe", "great");
INSERT INTO comments(username, comment) VALUES ("bob", "not the best");
INSERT INTO listings VALUES ("bob", "Honda", "Civic", "ABCD123", 5, 0, 1, 11.75);
INSERT INTO listings VALUES ("liz", "Ford", "Focus", "EFGH456", 3, 0, 1, 12);
INSERT INTO listings VALUES ("jeff", "Toyota", "Yaris", "IJKL789", 5, 1, 1, 13.50);
