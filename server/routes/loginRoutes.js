// Importing necessary modules.
const express = require('express');
const loginRouter = express.Router();   // Initializing a router object.

const { query } = require('../helpers/db.js');

const jwt = require('jsonwebtoken');    //To create the token

const bcrypt = require('bcrypt');

// To get user details
loginRouter.post('/', async (req, res) => 
{
    try 
    {
        const { username, password } = req.body;

        // Check if user exists
        const resultQuery = await query('SELECT * FROM users WHERE username = $1', [req.body.username]);
        if (resultQuery.rows.length == 0) 
        {
            return res.status(400).json({ message: 'Not an existing user. Please Register' });
        }

        // Check if the hashed password matches
        const match = await bcrypt.compare(req.body.password, resultQuery.rows[0].password);
        if (!match) 
        {
            return res.status(401).json({ message: 'Password does not match' });
        }

        // Generate a JWT when the user successfully logs in
        const token = jwt.sign(
            { userId: resultQuery.rows[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // Token expires in 8 hours
        );

        delete resultQuery.rows[0].password; // Remove the password from the user details sent to the client

        // Send successful login response
        res.status(200).json(
            {
            message: 'Login successful',
            token,
            userDetails: resultQuery.rows[0]
        });
    } 
    catch (error) 
    {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});



// Export 'loginRouter' so it can be imported and used in 'index.js' to define application routes.
module.exports = loginRouter;