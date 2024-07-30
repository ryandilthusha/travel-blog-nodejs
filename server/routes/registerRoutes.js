//Telling this application to import the express module, which is installed via npm (Node Package Manager), and make it available for use in this code.
const express = require('express');
const registerRouter = express.Router(); 
// Import query function from '../helpers/db.js'
const {query } = require('../helpers/db.js');
//const authenticateToken = require('../middleware/authenticateToken.js'); // Middleware to verify token


const bcrypt = require('bcrypt');


// Route handler for user registration
registerRouter.post('/', /*authenticateToken,*/async (req, res) => {
  
  try 
  {
    // Check if user with the provided username or email already exists
    const checkUser = await query('SELECT * FROM users WHERE username = $1', [req.body.username]);

    if (checkUser.rows.length > 0) {
      // User already exists, send back a response indicating registration failure
      return res.status(400).json({ message: 'User already registered' });
    }

    else
    {
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // User doesn't exist, proceed with registration
      const resultQuery = await query('INSERT INTO users (username, password) VALUES ($1, $2)', [req.body.username, hashedPassword]);

      // Send back a response indicating successful registration
      res.status(201).json({ message: 'Registration successful' });
    }
    
  } 
  
  catch (error) 
  {
    res.status(500).json({ error: 'An internal server error occurred' });
  }

});


module.exports = registerRouter;
