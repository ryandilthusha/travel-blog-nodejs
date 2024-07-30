// Importing necessary modules.
const express = require('express');
const { query } = require('../helpers/db.js'); 
const authenticateToken = require('../middleware/authenticateToken.js');    //Middleware to Verify Token

//These are for image uploading
const fileUpload = require('express-fileupload');
const path = require('path');


const bcrypt = require('bcrypt');

const profileRouter = express.Router();   // Initializing a router object.


//................................. ROUTE FOR USER PROFILE SECTION .................................//

// Define a GET route for '/headerdetails' to fetch user details. This route is protected by the authenticateToken middleware.
profileRouter.get('/headerDetails', authenticateToken, async (req, res) => 
{
    try 
    {
        const result = await query('SELECT * FROM users WHERE user_id = $1', [req.user.userId]);    //This userID comes from token's user object
        
        if (result.rows.length > 0)     
        {
            try //Try to catch if there any sytax error of this
            {
                res.json({ 
                    user_id: result.rows[0].user_id, 
                    username: result.rows[0].username, 
                    bio: result.rows[0].bio, 
                    profile_picture: result.rows[0].profile_picture,
                    followers_count: result.rows[0].followers_count});    // Send the user's database details as JSON. (This send to Fronend profile.js file)
            }

            catch(error)
            {
                res.status(400).json({message:error.message});
            }
            
        } 
        else 
        {
            res.status(401).json({ message: 'User not found' });    // If no rows are returned, the user does not exist in the database. 
        }
    } 

    catch (error) 
    {
        res.status(402).json({ message: 'Internal server error' });
    }
});



//................................. ROUTE FOR FETCH DETAILS FOR WHOLE TRAVEL STATS SECTION .................................//
profileRouter.get('/travelerStats', authenticateToken, async (req, res) => 
{
    try 
    {
        const result = await query('SELECT * FROM travel_stats WHERE user_id = $1', [req.user.userId]); // Use userID from token's user object
        
        if (result.rows.length > 0) 
        {
            res.json(result.rows[0]);       // Send the user's database details as JSON. (This send to Fronend profile.js file)
        } 

        else 
        {
            res.status(404).json({ message: 'Stats not found' });
        }
    } 
    
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





//................................. ROUTE FOR GET USER DETAILS FOR FORM CONTROL TEXT FEILDS .................................//
profileRouter.get('/getUserDetails', authenticateToken, async (req, res) => 
{
    // Proceed without hashing the password. Note: Storing passwords in plain text is not secure.

    try 
    {
        const resultQuery = await query('SELECT * FROM users WHERE user_id = $1', [req.user.userId] );

        if (resultQuery.rows.length === 0) 
        {
            // User not found in database
            return res.status(401).json({ message: 'User not found.' });
        }

        else
        {
            // Return updated user details (excluding password)
            res.status(200).json(
                {
                    username: resultQuery.rows[0].username,
                    bio: resultQuery.rows[0].bio,
                    propic: resultQuery.rows[0].profile_picture
                });
        }
        

    } 
    
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
});


//................................. ROUTE FOR POST NEW USER DETAILS WHICH FETCH FROM FRONTEND profile.js .................................//
profileRouter.post('/saveNewUserDetails', authenticateToken, async (req, res) => 
{
    
    // Proceed without hashing the password.

    try 
    {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const result = await query(
            'UPDATE users SET username = $1, password = $2, bio = $3 WHERE user_id = $4 RETURNING username, bio;', // Not returning the password
            [req.body.username, hashedPassword, req.body.bio, req.user.userId]
        );

        if (result.rows.length === 0) 
        {
            // User not found in database
            return res.status(404).json({ message: 'User not found.' });
        }

        else
        {
            // Return updated user details (excluding password)
            res.json(result.rows[0]);
        }        

    } 
    
    catch (error) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
});







//................................. NOW ROUTES FOR POST(UPDATE) THE Travel Stat SECTION .................................//

//................................. i. ROUTE FOR POST(UPDATE) THE Travel Stat - Countries Visited .................................//
profileRouter.post('/countriesVisited', authenticateToken, async (req, res) => 
{
    console.log("Received userID from token:", req.user.userId);
        
    try 
    {
        // First, check if there is an existing entry for the user
        const existingStats = await query(
            'SELECT * FROM travel_stats WHERE user_id = $1;',
            [req.user.userId]
        );

        if (existingStats.rows.length === 0) 
        {
            console.log("New user");

            // No existing stats, consider inserting default data or returning a specific message
            // Here, we opt to insert a new record with default values
            const result = await query(
                'INSERT INTO travel_stats (user_id, countries_visited) VALUES ($1, $2) RETURNING *;',
                [req.user.userId, req.body.countriesVisited]
            );

            res.json(result.rows[0]);   // If the update is successful, return the updated record.
        }

        else
        {
            console.log("Existing user");

            const result = await query(
                'UPDATE travel_stats SET countries_visited = $1 WHERE user_id = $2 RETURNING *;',
                [req.body.countriesVisited, req.user.userId]  // Substitute $1 and $2 with "countriesVisited" and "userId" values respectively.
            );
    
            // Additional Part: Check if the query didn't update any rows, possibly because the user ID doesn't exist in "travel_stats".
            if (result.rows.length === 0) {
                // No rows updated, possibly because the user_id doesn't exist in travel_stats
                return res.status(404).json({ message: 'User stats not found.' });
            }
    
            res.json(result.rows[0]);   // If the update is successful, return the updated record.
        }
        
    } 
    
    catch (error) 
    {
        console.error('Failed to update countries visited:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



//................................. ii. ROUTE FOR POST(UPDATE) THE Travel Stat - Cities Explored .................................//
// Example using Express.js and assuming `query` is a function to execute SQL commands
profileRouter.post('/citiesExplored', authenticateToken, async (req, res) => {

    try 
    {
        // First, check if there is an existing entry for the user
        const existingStats = await query(
            'SELECT * FROM travel_stats WHERE user_id = $1;',
            [req.user.userId]
        );

        if (existingStats.rows.length === 0) 
        {
            console.log("New user");

            // No existing stats, consider inserting default data or returning a specific message
            // Here, we opt to insert a new record with default values
            const result = await query(
                'INSERT INTO travel_stats (user_id, cities_explored) VALUES ($1, $2) RETURNING *;',
                [req.user.userId, req.body.citiesExplored]
            );

            res.json(result.rows[0]);   // If the update is successful, return the updated record.
        }

        else
        {
            console.log("Existing user");

            const result = await query(
                'UPDATE travel_stats SET cities_explored = $1 WHERE user_id = $2 RETURNING *;',
                [req.body.citiesExplored, req.user.userId]  // Substitute $1 and $2 with "countriesVisited" and "userId" values respectively.
            );
    
            // Additional Part: Check if the query didn't update any rows, possibly because the user ID doesn't exist in "travel_stats".
            if (result.rows.length === 0) {
                // No rows updated, possibly because the user_id doesn't exist in travel_stats
                return res.status(404).json({ message: 'User stats not found.' });
            }
    
            res.json(result.rows[0]);   // If the update is successful, return the updated record.
        }
        
    } 
    
    catch (error) {
        console.error('Failed to update cities explored:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



//................................. iii. ROUTE FOR POST(UPDATE) THE Travel Stat - Favorite Destination .................................//
// Example using Express.js
profileRouter.post('/favoriteDestination', authenticateToken, async (req, res) => 
{

    try 
    {
        // First, check if there is an existing entry for the user
        const existingStats = await query(
            'SELECT * FROM travel_stats WHERE user_id = $1;',
            [req.user.userId]
        );

        if (existingStats.rows.length === 0) 
        {
            console.log("New user");

            // No existing stats, consider inserting default data or returning a specific message
            // Here, we opt to insert a new record with default values
            const result = await query(
                'INSERT INTO travel_stats (user_id, favorite_destination) VALUES ($1, $2) RETURNING *;',
                [req.user.userId, req.body.favoriteDestination]
            );

            res.json(result.rows[0]);   // If the update is successful, return the updated record.
        }

        else
        {
            console.log("Existing user");

            const result = await query(
                'UPDATE travel_stats SET favorite_destination = $1 WHERE user_id = $2 RETURNING *;',
                [req.body.favoriteDestination, req.user.userId]  // Substitute $1 and $2 with "countriesVisited" and "userId" values respectively.
            );
    
            // Additional Part: Check if the query didn't update any rows, possibly because the user ID doesn't exist in "travel_stats".
            if (result.rows.length === 0) {
                // No rows updated, possibly because the user_id doesn't exist in travel_stats
                return res.status(404).json({ message: 'User stats not found.' });
            }
    
            res.json(result.rows[0]);   // If the update is successful, return the updated record.
        }
        
    } 
    
    catch (error) {
        console.error('Failed to update favorite destination:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




//................................. iv. ROUTE FOR POST(UPDATE) THE Travel Stat - Bucket List .................................//
profileRouter.post('/bucketList', authenticateToken, async (req, res) => {

    try 
    {
        // First, check if there is an existing entry for the user
        const existingStats = await query(
            'SELECT * FROM travel_stats WHERE user_id = $1;',
            [req.user.userId]
        );

        if (existingStats.rows.length === 0) 
        {
            console.log("New user");

            // No existing stats, consider inserting default data or returning a specific message
            // Here, we opt to insert a new record with default values
            const result = await query(
                'INSERT INTO travel_stats (user_id, bucket_list) VALUES ($1, $2) RETURNING *;',
                [req.user.userId, req.body.bucketList]
            );

            res.json(result.rows[0]);   // If the update is successful, return the updated record.
        }

        else
        {
            console.log("Existing user");

            const result = await query(
                'UPDATE travel_stats SET bucket_list = $1 WHERE user_id = $2 RETURNING *;',
                [req.body.bucketList, req.user.userId]  // Substitute $1 and $2 with "countriesVisited" and "userId" values respectively.
            );
    
            // Additional Part: Check if the query didn't update any rows, possibly because the user ID doesn't exist in "travel_stats".
            if (result.rows.length === 0) {
                // No rows updated, possibly because the user_id doesn't exist in travel_stats
                return res.status(404).json({ message: 'User stats not found.' });
            }
    
            res.json(result.rows[0]);   // If the update is successful, return the updated record.
        }
        
    } 
    
    catch (error) {
        console.error('Failed to update bucket list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});






//................................. ROUTE FOR UPLOADING PROFILE PIC .................................//

/// Enable files upload
profileRouter.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 15 * 1024 * 1024 }, // 5MB limit
}));


profileRouter.post('/newpic', authenticateToken, async (req, res) => {
    console.log(req.files);  // Debugging to check what files data is coming
    console.log(req.body);   // Check other fields data
    
    
    // Check if the file was uploaded
    const profilePic = req.files ? req.files.profilePic : null;
    if (!profilePic) {
        return res.status(400).send('No profilePic image uploaded.');
    }

    const uploadPath = path.join(__dirname, '../public/pro-images/', `${req.user.userId}-${profilePic.name}`);

    profilePic.mv(uploadPath, async (err) => 
    {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).send(err);
        }

        const imagePath = `pro-images/${req.user.userId}-${profilePic.name}`;
        const sql = 'UPDATE users SET profile_picture = $1 WHERE user_id = $2 returning *';
        const result = await query(sql, [imagePath, req.user.userId]);

        if (result.rows.length > 0) 
        {
            res.status(200).json(result.rows[0]);
            console.log(result.rows[0])
        } 
        else 
        {
            res.status(404).json({ message: 'User not found.' });
        }
    });
});







// Export the router to make it available for use in other parts of the application, particularly in the main server file (index.js).
module.exports = profileRouter;