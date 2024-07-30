// Create a router
const express = require("express");

const allpostsRouter = express.Router(); // Instantiate a new router
const { query } = require("../helpers/db.js"); //Import database helper

const authenticateToken = require("../middleware/authenticateToken.js"); // Import authentication middleware


const fileUpload = require('express-fileupload');
const path = require('path');




// Route to get all posts
allpostsRouter.get("/getAllPosts/", authenticateToken, async (req, res) => {
  try {
    // Query the database to get all posts
    const result = await query(
      `
    SELECT
    p.post_id,
    p.title,
    p.content,
    to_char(p.post_date, 'FMDay, FMDDth FMMonth YYYY at FMHH12:MIPM') as formatted_post_date,
    p.cover_image,
    u.username,
    u.profile_picture,
    (SELECT COUNT(likes.like_id) FROM likes WHERE likes.post_id = p.post_id) AS likes_count,
    (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) AS comments_count
  FROM 
    posts p
  JOIN
    users u ON p.user_id = u.user_id
  WHERE
    p.user_id = $1
  GROUP BY
      p.post_id, u.username, u.profile_picture
  ORDER BY 
    p.post_date DESC
        `,
      [req.user.userId]
    );

    // Send the retrieved posts as JSON response
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



// To update the post details
allpostsRouter.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
}));

// To update the post details
allpostsRouter.post("/update", authenticateToken, async (req, res) => {
  try {
      console.log("Update endpoint hit");
      const { title, content, post_id } = req.body;
      console.log(title, content, post_id);
      let imagePath;

      if (req.files && req.files.cover_image) {
          const coverImage = req.files.cover_image;
          const uploadPath = path.join(__dirname, '../public/images', `${post_id}-${coverImage.name}`);
          await coverImage.mv(uploadPath);
          imagePath = `images/${post_id}-${coverImage.name}`;
      }

      let sqlQuery;
      let params;

      if (imagePath) 
      {
          console.log("Image has");
          sqlQuery = 'UPDATE posts SET title = $1, content = $2, cover_image = $3 WHERE post_id = $4 RETURNING *';
          params = [title, content, imagePath, post_id];
      } else 
      {
          console.log("No image");
          console.log(title, content, post_id);
          sqlQuery = 'UPDATE posts SET title = $1, content = $2 WHERE post_id = $3 RETURNING *';
          params = [title, content, post_id];
      }

      const result = await query(sqlQuery, params);
      if (result.rows.length > 0) 
      {
          res.json(result.rows[0]);
      } else {
          res.status(404).json({ error: 'Post not found' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
  }
});






allpostsRouter.delete('/deletePost', async (req, res) => 
{
  
  try 
  {
      // Assuming you're using some ORM or database query method
      const result = await query('DELETE FROM posts WHERE post_id = $1 RETURNING *', 
      [req.body.post_id]);

      if(result.rowCount > 0) 
      {
        res.status(200).json(result.rows[0]);
      } 
      else 
      {
        res.status(404).json({ message: 'Post not found' });
      }
  } 
  
  catch (error) 
  {
      res.status(500).json({ message: 'Internal server error' });
  }
});


// Endpoint to remove a picture
allpostsRouter.delete('/removePicture/:postId', authenticateToken, async (req, res) => {
  const { postId } = req.params;

  try {
      const sql = 'UPDATE posts SET cover_image = NULL WHERE post_id = $1 RETURNING *';
      const result = await query(sql, [postId]);

      if (result.rowCount > 0) {
          res.status(200).json({ message: 'Picture removed successfully.', post: result.rows[0] });
      } else {
          res.status(404).json({ message: 'Post not found.' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});





// Endpoint to search posts
allpostsRouter.get('/search', authenticateToken ,async (req, res) => {
  const searchQuery = req.query.query; // Retrieve the 'query' parameter from the URL
  if (!searchQuery) {
      return res.status(400).json({ error: 'No search term provided' });
  }

  try {
      const results = await query(
          `
          SELECT
            p.post_id,
            p.title,
            p.content,
            p.post_date,
            p.cover_image,
            u.username,
            u.profile_picture,
            (SELECT COUNT(likes.like_id) FROM likes WHERE likes.post_id = p.post_id) AS likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) AS comments_count
          FROM 
            posts p
          JOIN
            users u ON p.user_id = u.user_id
          WHERE
            (p.title ILIKE $1 OR p.content ILIKE $1) AND p.user_id = $2
          GROUP BY
            p.post_id, u.username, u.profile_picture
          ORDER BY 
            p.post_date DESC
          `,
          [`%${searchQuery}%`, req.user.userId] // Use placeholders to prevent SQL injection
      );
      res.json(results.rows);
  } 
  catch (error) {
      console.error('Search Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});




// Export the postRouter object
module.exports = allpostsRouter;
