// Importing necessary modules.
const express = require('express');
const indexRouter = express.Router();   // Initializing a router object.

const { query } = require('../helpers/db.js'); 

// Get All Posts
indexRouter.get('/allPosts' ,async (req, res) => {
    try 
    {
        const result = await query(`
        SELECT
            p.post_id,
            p.title,
            p.content,
            p.post_date,
            p.cover_image,
            p.category_name,
            u.username,
            u.profile_picture,
            (SELECT COUNT(likes.like_id) FROM likes WHERE likes.post_id = p.post_id) AS likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) AS comments_count
        FROM 
            posts p
        JOIN
            users u ON p.user_id = u.user_id
        GROUP BY
            p.post_id, u.username, u.profile_picture
        ORDER BY 
            p.post_date DESC
        `);
        res.json(result.rows);
    } 
    catch (error) 
    {
        res.status(500).send('Server error');
    }
});


indexRouter.get('/search', async (req, res) => {
    const searchQuery = req.query.query; // Retrieve the 'query' parameter from the URL
    if (!searchQuery) {
        return res.status(400).json({ error: 'No search term provided' });
    }

    try {
        const results = await query(`
            SELECT
                p.post_id,
                p.title,
                p.content,
                p.post_date,
                p.cover_image,
                p.category_name,
                u.username,
                u.profile_picture,
                (SELECT COUNT(likes.like_id) FROM likes WHERE likes.post_id = p.post_id) AS likes_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) AS comments_count
            FROM 
                posts p
            JOIN
                users u ON p.user_id = u.user_id
            WHERE
                p.title ILIKE $1 OR p.content ILIKE $1
            GROUP BY
                p.post_id, u.username, u.profile_picture
            ORDER BY 
                p.post_date DESC
            `, [`%${searchQuery}%`]
        );
        res.json(results.rows);
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Search a Post by Category Name
indexRouter.get('/searchCategory', async (req, res) => {
    const searchQuery = req.query.query; // Retrieve the 'query' parameter from the URL
    if (!searchQuery) {
        return res.status(400).json({ error: 'No search term provided' });
    }

    try {
        const results = await query(`
            SELECT
                p.post_id,
                p.title,
                p.content,
                p.post_date,
                p.cover_image,
                p.category_name,
                u.username,
                u.profile_picture,
                (SELECT COUNT(likes.like_id) FROM likes WHERE likes.post_id = p.post_id) AS likes_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) AS comments_count
            FROM 
                posts p
            JOIN
                users u ON p.user_id = u.user_id
            WHERE
                p.category_name ILIKE $1
            GROUP BY
                p.post_id, u.username, u.profile_picture
            ORDER BY 
                p.post_date DESC
            `, [`%${searchQuery}%`]
        );
        res.json(results.rows);
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



//Get Most Popular Posts
indexRouter.get('/popularPosts', async (req, res) => {
    try 
    {
        const result = await query(`
            SELECT 
                p.post_id, 
                p.title, 
                p.cover_image,
                COUNT(DISTINCT l.like_id) AS likes_count,
                COUNT(DISTINCT c.comment_id) AS comments_count
            FROM 
                posts p
            LEFT JOIN 
                likes l ON p.post_id = l.post_id
            LEFT JOIN 
                comments c ON p.post_id = c.post_id
            GROUP BY 
                p.post_id
            ORDER BY 
                likes_count DESC, comments_count DESC
            LIMIT 4;
        `);
        res.json(result.rows);
    } 
    
    catch (error) 
    {
        console.error('Error fetching popular posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});










module.exports = indexRouter;
