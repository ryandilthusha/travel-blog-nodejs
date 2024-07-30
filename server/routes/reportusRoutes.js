// Create a router
const express = require('express');
const reportusRouter = express.Router();

const { query } = require('../helpers/db.js'); // Import database helper
const authenticateToken = require('../middleware/authenticateToken.js'); // Middleware to verify token

//const jwt = require('jsonwbtoken');
reportusRouter.post('/report',authenticateToken,async(req,res) => 
{

    try
    {
        console.log(req.body.postId)
        console.log(req.body.reportReason)
        console.log(req.user.userId)

        if (req.body.postId == null) 
        {
            // SQL to insert report into the database
            const result = await query(`INSERT INTO reports (user_id,report_reason) VALUES ($1, $2)`, 
            [req.user.userId,req.body.reportReason])
                
            res.status(200).json({ message: 'Report submitted successfully' });

        }
        else
        {
            // SQL to insert report into the database
            const result = await query(`INSERT INTO reports (post_id, user_id, report_reason) VALUES ($1, $2, $3)`, 
            [req.body.postId, req.user.userId, req.body.reportReason])
                
            res.status(201).json({ message: 'Report submitted successfully' });
        }

        

    }

    catch(error)
    {
        res.status(500).json({ message: "Internal server error" })
    }
    

})




reportusRouter.get('/details/:postId', authenticateToken, async (req, res) => {
    const postId = req.params.postId;
    try {
        const result = await query(
            "SELECT post_id, title, content, cover_image FROM posts WHERE post_id = $1",
            [postId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = reportusRouter;
    
