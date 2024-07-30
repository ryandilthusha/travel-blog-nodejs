-- ****** Create a Database with this name: travelBlog ******
-- CREATE DATABASE travelBlog;

-- DROP existing Tables
DROP TABLE IF EXISTS reports;
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




-- ............................................. TRAVEL STATS TABLE .............................................

-- travel_stats Table (For Profile)
CREATE TABLE travel_stats (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    countries_visited INT,
    cities_explored INT,
    favorite_destination VARCHAR(255),
    bucket_list TEXT  -- This could be a long list, so TEXT is used
);





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




-- ............................................. COMMENTS TABLE .............................................

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    comment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



-- ............................................. LIKES TABLE .............................................

-- Likes Table
CREATE TABLE IF NOT EXISTS likes (
    like_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    like_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);





-- ............................................. REPORT TABLE .............................................
CREATE TABLE IF NOT EXISTS reports (
    report_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    report_reason TEXT NOT NULL,
    report_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



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

