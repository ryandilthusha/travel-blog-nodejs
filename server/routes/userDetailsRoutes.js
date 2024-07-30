// Create a router
const express = require("express");

const userDetailsRouter = express.Router(); // Instantiate a new router
const { query } = require("../helpers/db.js"); //Import database helper

const authenticateToken = require("../middleware/authenticateToken.js"); // Import authentication middleware




// Endpoint to fetch user profile details
userDetailsRouter.post('/userProfile', async (req, res) => 
{
    try {
        const { rows } = await query('SELECT username, bio, profile_picture FROM users WHERE user_id = $1', [req.body.user_id]); // Example user_id
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to fetch user stats
userDetailsRouter.post('/userStats', async (req, res) => {
    try {
        const posts = await query('SELECT COUNT(*) FROM posts WHERE user_id = $1', [req.body.user_id]);
        const likes = await query('SELECT COUNT(*) FROM likes WHERE user_id = $1', [req.body.user_id]);
        const comments = await query('SELECT COUNT(*) FROM comments WHERE user_id = $1', [req.body.user_id]);
        
        res.json({
            totalPosts: posts.rows[0].count,
            totalLikes: likes.rows[0].count,
            totalComments: comments.rows[0].count
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to fetch travel stats
userDetailsRouter.post('/travelStats', async (req, res) => {
    try 
    {
        const result  = await query('SELECT countries_visited, cities_explored, favorite_destination, bucket_list FROM travel_stats WHERE user_id = $1', [req.body.user_id]);
        res.json(result.rows[0]);
    } 
    catch (error) 
    {
        console.error('Error fetching travel stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get Most Popular Posts for a specific user
userDetailsRouter.post('/popularPosts/', async (req, res) => {
  const userId = req.params.userId; // Obtain user ID from URL parameter

  try {
      const queryText = `
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
          WHERE 
              p.user_id = $1  
          GROUP BY 
              p.post_id
          ORDER BY 
              likes_count DESC, comments_count DESC
          LIMIT 10;
      `;

      const result = await query(queryText, [req.body.user_id]); // Execute the query with user ID as parameter
      res.json(result.rows);
  } 
  
  catch (error) 
  {
      console.error('Error fetching popular posts for user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



// Export the postRouter object
module.exports = userDetailsRouter;
