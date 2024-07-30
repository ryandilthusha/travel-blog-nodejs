-- ****** Create a Database with this name: travelBlog ******
-- CREATE DATABASE travelBlog;

-- DROP existing Tables
DROP TABLE IF EXISTS travel_stats;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- ............................................. USERS TABLE .............................................

-- users Table (For Login and Registration)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_picture TEXT
);

-- Insert some sample users
INSERT INTO users (username, password, bio, profile_picture) 
VALUES ('123', '123', 'My name is 123', 'default-profile.jpg');
INSERT INTO users (username, password, bio, profile_picture) 
VALUES ('groupu', '123', 'Hey there, I''m from Finland', 'default-profile.jpg');

SELECT * FROM users;



-- ............................................. TRAVEL STATS TABLE .............................................

-- travel_stats Table (For Profile)
CREATE TABLE travel_stats (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    countries_visited INT,
    cities_explored INT,
    favorite_destination VARCHAR(255),
    bucket_list TEXT  -- This could be a long list, so TEXT is used
);

INSERT INTO travel_stats (user_id, countries_visited, cities_explored, favorite_destination, bucket_list)
VALUES (1, 10, 25, 'Japan', 'Visit the Pyramids of Egypt, Explore the Amazon Rainforest');
INSERT INTO travel_stats (user_id, countries_visited, cities_explored, favorite_destination, bucket_list)
VALUES (2, 2, 2, 'SL', 'Play Games');

SELECT * FROM travel_stats;



-- ............................................. POSTS TABLE .............................................

-- Posts Table (Includes Categories as a field)
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    category_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cover_image TEXT
);

-- Insert some sample posts
-- Note: You should adjust these values according to your actual users' IDs and desired content.
INSERT INTO posts (user_id, category_name, title, content, cover_image) VALUES
(1, 'Travel', 'My Journey to Japan', 'It was a fantastic experience!', './images/post/post_1.jpg'),
(1, 'Adventure', 'My Journey to Finland', 'Great!!!', './images/post/post_2.jpg'),
(2, 'Travel', 'Finland Journey', 'Great!!!', './images/post/post_3.jpg'),
(2, 'Adventure', 'Climbing in Sri Lanka', 'Climbing Adam''s Peak was breathtaking.', './images/post/post_4.jpg'),

(1, 'Games', 'Sri Lanka!!!', 'It was a fantastic experience!', './images/post/post_2.jpg'),
(1, 'Swim', 'Jouney of Carlos', 'Great!!!', './images/post/post_3.jpg'),
(2, 'Fun', 'Me with my friend', 'Great!!!', './images/post/post_4.jpg'),
(2, 'Photography', 'We played here', 'Climbing Adam''s Peak was breathtaking.', './images/post/post_1.jpg'),

(1, 'Travel', 'My Journey to Japan', 'It was a fantastic experience!', './images/post/post_3.jpg'),
(1, 'Adventure', 'My Journey to Finland', 'Great!!!', './images/post/post_4.jpg'),
(2, 'Travel', 'Finland Journey', 'Great!!!', './images/post/post_1.jpg'),
(2, 'Adventure', 'Climbing in Sri Lanka', 'Climbing Adam''s Peak was breathtaking.', './images/post/post_2.jpg'),

(1, 'Games', 'Sri Lanka!!!', 'It was a fantastic experience!', './images/post/post_4.jpg'),
(1, 'Swim', 'Jouney of Carlos', 'Great!!!', './images/post/post_1.jpg'),
(2, 'Fun', 'Me with my friend', 'Great!!!', './images/post/post_2.jpg'),
(2, 'Photography', 'We played here', 'Climbing Adam''s Peak was breathtaking.', './images/post/post_3.jpg'),

(1, 'Travel', 'My Journey to Japan', 'It was a fantastic experience!', './images/post/post_1.jpg'),
(1, 'Adventure', 'My Journey to Finland', 'Great!!!', './images/post/post_2.jpg'),
(2, 'Travel', 'Finland Journey', 'Great!!!', './images/post/post_3.jpg'),
(2, 'Adventure', 'Climbing in Sri Lanka', 'Climbing Adam''s Peak was breathtaking.', './images/post/post_4.jpg'),

(1, 'Games', 'Sri Lanka!!!', 'It was a fantastic experience!', './images/post/post_2.jpg'),
(1, 'Swim', 'Jouney of Carlos', 'Great!!!', './images/post/post_3.jpg'),
(2, 'Fun', 'Me with my friend', 'Great!!!', './images/post/post_4.jpg'),
(2, 'Photography', 'We played here', 'Climbing Adam''s Peak was breathtaking.', './images/post/post_1.jpg'),

(1, 'Travel', 'My Journey to Japan', 'It was a fantastic experience!', './images/post/post_3.jpg'),
(1, 'Adventure', 'My Journey to Finland', 'Great!!!', './images/post/post_4.jpg'),
(2, 'Travel', 'Finland Journey', 'Great!!!', './images/post/post_1.jpg'),
(2, 'Adventure', 'Climbing in Sri Lanka', 'Climbing Adam''s Peak was breathtaking.', './images/post/post_2.jpg'),

(1, 'Games', 'Sri Lanka!!!', 'It was a fantastic experience!', './images/post/post_4.jpg'),
(1, 'Swim', 'Jouney of Carlos', 'Great!!!', './images/post/post_1.jpg'),
(2, 'Fun', 'Me with my friend', 'Great!!!', './images/post/post_2.jpg'),
(2, 'Photography', 'We played here', 'Climbing Adam''s Peak was breathtaking.', './images/post/post_3.jpg');


SELECT * FROM posts;


-- ............................................. COMMENTS TABLE .............................................

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    comment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample comments with specific timestamps
INSERT INTO comments (post_id, user_id, comment_text, comment_date) VALUES
(1, 1, 'Love this post about Japan!', '2023-10-01 14:30:00'),
(1, 2, 'Really inspiring journey!', '2023-10-01 15:00:00'),
(2, 2, 'I want to visit Finland too!', '2023-10-02 16:00:00'),
(3, 1, 'Nice insights on Finland!', '2023-10-02 17:00:00'),
(4, 2, 'Climbing Adam''s Peak is on my bucket list!', '2023-10-03 18:00:00');

SELECT * FROM comments;

-- ............................................. LIKES TABLE .............................................

-- Likes Table
CREATE TABLE IF NOT EXISTS likes (
    like_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    like_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample likes with specific timestamps
INSERT INTO likes (post_id, user_id, like_date) VALUES
(1, 1, '2023-10-01 19:00:00'),
(1, 2, '2023-10-01 20:00:00'),
(2, 1, '2023-10-02 21:00:00'),
(3, 1, '2023-10-02 22:00:00'),
(3, 2, '2023-10-03 23:00:00'),
(4, 1, '2023-10-04 23:30:00'),
(4, 2, '2023-10-05 00:00:00');

SELECT * FROM likes;







-- ..................................................................................................

-- Example of how to query joined data
-- This will get all the details of the all posts
SELECT 
    p.post_id,
    p.title,
    p.content,
    p.post_date,
    p.cover_image,
    u.username,
    u.profile_picture,
    ARRAY_AGG(DISTINCT c.comment_text) AS comments,
    COUNT(DISTINCT l.like_id) AS like_count
FROM 
    posts p
JOIN 
    users u ON p.user_id = u.user_id
LEFT JOIN 
    comments c ON p.post_id = c.post_id
LEFT JOIN 
    likes l ON p.post_id = l.post_id
GROUP BY
    p.post_id, p.title, p.content, p.post_date, p.cover_image, u.username, u.profile_picture
ORDER BY
    p.post_date DESC;


    --___________________________________________________________________________________contactus table__________________
    -- contactus table

    CREATE TABLE contact_us (
    contact_us_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    contact_number VARCHAR(20) NULL,
    email VARCHAR(255) NOT NULL
    comments VARCHAR(255) NOT NULL
    
);

-- insert data into the table

insert into contact_us (name,contact_number,email,comments) values ('James Smith','+3580417230250','jame@foo.com','Need Assistance on adding images');
