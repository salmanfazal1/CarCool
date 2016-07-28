

CREATE TABLE users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    rating INTEGER DEFAULT 0,
    is_admin INTEGER DEFAULT 0
);

CREATE TABLE rulers (
    username TEXT NOT NULL,
    location POINT NOT NULL,

    FOREIGN KEY(username) REFERENCES users(username)
);

CREATE TABLE payment (
    username TEXT NOT NULL,
    num INTEGER PRIMARY KEY,
    sec_code INTEGER NOT NULL,
    expiry TEXT NOT NULL,

    FOREIGN KEY(username) REFERENCES users(username)
);

CREATE TABLE exchange (
    ex_id INTEGER PRIMARY KEY,
    cooler TEXT NOT NULL,
    ruler TEXT NOT NULL,

    FOREIGN KEY(cooler) REFERENCES users(username),
    FOREIGN KEY(ruler) REFERENCES users(username)
);

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

CREATE TABLE ratings_per_user (
    username TEXT PRIMARY KEY,
    rating score NOT NULL,
    recommend INTEGER NOT NULL,

    FOREIGN KEY(username) REFERENCES users(username)
);

CREATE TABLE comments (
    c_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    comment TEXT NOT NULL,
    timestamp INTEGER NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY(username) REFERENCES users(username)
);

CREATE TABLE listings (
    username TEXT NOT NULL,
    car_type TEXT NOT NULL,
    license_plate TEXT NOT NULL PRIMARY KEY,
    seats TEXT,
    ac TEXT,
    auto TEXT,
    price TEXT NOT NULL,
    FOREIGN KEY(username) REFERENCES users(username)
);
