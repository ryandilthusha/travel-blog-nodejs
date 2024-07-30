// Create a router
const express = require('express');
const postRouter = express.Router();

const { query } = require('../helpers/db.js'); // Import database helper
const authenticateToken = require('../middleware/authenticateToken.js'); // Middleware to verify token

// Define Route to GET all post data
postRouter.post('/getPostData', authenticateToken, async (req, res) => {
    try 
    {        
        const resultQuery = await query(`
        SELECT 
        p.post_id,
        p.title,
        p.content,
        to_char(p.post_date, 'FMDay, FMDDth FMMonth YYYY at FMHH12:MIPM') as formatted_post_date,
        p.cover_image,
        p.user_id,
        u.username,
        u.profile_picture
        FROM 
            posts p
        JOIN 
            users u ON p.user_id = u.user_id
        WHERE 
            p.post_id = $1
        GROUP BY
            p.post_id, p.title, p.content, p.post_date, p.cover_image, u.username, u.profile_picture
        ORDER BY
            p.post_date DESC;`, [req.body.postId]);

        if (resultQuery.rows.length > 0) {
            res.json(resultQuery.rows[0]);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error accessing the database:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Define Route to GET all comment data
postRouter.post('/getCommentData', authenticateToken, async (req, res) => {
    try 
    {        
        const resultQuery = await query(`
        SELECT
            c.comment_id,
            c.post_id,
            c.user_id,
            u.username,
            u.profile_picture,
            to_char(c.comment_date, 'FMDay, FMDDth FMMonth YYYY at FMHH12:MIPM') as formatted_comment_date,
            c.comment_text
        FROM
            comments c
        JOIN
            users u ON c.user_id = u.user_id
        WHERE 
            post_id = $1
        ORDER BY
            c.comment_date DESC;`, [req.body.postId]);

        if (resultQuery.rows.length > 0) 
        {
            res.json({
                result: resultQuery.rows,
                user: req.user.userId
            });
        } 
        else 
        {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        console.error('Error accessing the database:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Define Route to GET likes count and comments count
postRouter.post('/getLikesCount', authenticateToken, async (req, res) => {
    try 
    {        
        const resultQuery = await query(`
        SELECT 
            p.post_id,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) AS likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) AS comments_count
        FROM posts p
        WHERE post_id = $1
        GROUP BY p.post_id
        ORDER BY p.post_id;`, [req.body.postId]);

        if (resultQuery.rows.length > 0) {
            res.json(resultQuery.rows[0]);
        } else {
            res.status(404).json({ message: 'Like count not found' });
        }
    } catch (error) {
        console.error('Error accessing the database:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


postRouter.post('/makeComment', authenticateToken, async(req,res) =>
{
    const resultQuery = await query('INSERT INTO comments(post_id,user_id,comment_text)  VALUES ($1,$2,$3) RETURNING *', 
    [req.body.postId, req.user.userId,req.body.comment]);

    res.json(
        {
            commentDetails: resultQuery.rows, 
            comment:'Comment Successful'
        });
});


// POST route to update a comment
postRouter.post('/updateComment/:commentId', authenticateToken, async (req, res) => 
{
    try 
    {
        const result = await query(
            'UPDATE comments SET comment_text = $1 WHERE comment_id = $2 AND user_id = $3 RETURNING *',
            [req.body.commentText, req.params.commentId, req.user.userId]
        );

        if (result.rows.length > 0) 
        {
            res.status(200).json(result.rows[0]);
        } 
        else 
        {
            res.status(404).json({ message: 'Comment not found or you do not have permission to edit it' });
        }
    } 
    catch (error) 
    {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// POST route to delete a comment
postRouter.delete('/deleteComment/:commentId', authenticateToken, async (req, res) => 
{

    try {
        // Perform the deletion only if the comment belongs to the user
        const result = await query('DELETE FROM comments WHERE comment_id = $1 AND user_id = $2 RETURNING *', 
        [req.params.commentId, req.user.userId]);

        if (result.rows.length > 0) 
        {
            res.status(200).json({ message: 'Comment deleted successfully' });
        } 
        else 
        {
            // If no rows are affected, the comment did not exist or did not belong to the user
            res.status(404).json({ message: 'Comment not found or not owned by user' });
        }
    } 
    catch (error) 
    {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// POST route to check a like
// GET route to check if a post is liked by the current user
postRouter.get('/checkLike/:postId', authenticateToken, async (req, res) => {
    try {

        const result = await query('SELECT * FROM likes WHERE user_id = $1 AND post_id = $2', [req.user.userId, req.params.postId]);
        if (result.rowCount > 0) {
            res.json({ alreadyLiked: true });
        } else {
            res.json({ alreadyLiked: false });
        }
    } catch (error) {
        console.error('Error checking like status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST route to make a like
postRouter.post('/makeLike', authenticateToken, async (req, res) => 
{
    try 
    {
        // Check if the user has already liked the post
        const checkLike = await query('SELECT * FROM likes WHERE user_id = $1 AND post_id = $2', 
        [req.user.userId, req.body.postId]);

        if (checkLike.rowCount > 0) 
        {
            return res.json(
                { 
                    alreadyLiked: true, 
                    message: 'You have already liked this post.' 
                });
        }


        else if(checkLike.rowCount === 0)
        {
            // Insert the like if not already liked
            const insertLike = await query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *', [req.user.userId, req.body.postId]);
            res.status(200).json(
                { 
                    alreadyLiked: false, 
                    message: 'Like added successfully.' 
                });
        }
        
    } 
    catch (error) 
    {
        console.error('Error making like:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = postRouter; // Export the postRouter object
