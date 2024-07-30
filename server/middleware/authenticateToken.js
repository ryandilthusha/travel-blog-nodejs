const jwt = require('jsonwebtoken');    // Require the jsonwebtoken package to verify JWT tokens.


// Define a middleware function to authenticate JWT tokens.
function authenticateToken(req, res, next) 
{
    
    const authHeader = req.headers['authorization'];    // Retrieve the 'Authorization' header from the incoming request
    const tokenPart = authHeader.split(' ')[1];   
    
    if (tokenPart == null)
    {
        return res.status(401).json({ message: 'No token provided' });  
    } 
    
    else
    {
        jwt.verify(tokenPart, process.env.JWT_SECRET, (err, user) => 
        {
            
            if (err)
            {
                return res.status(403).json({ message: 'Token is not valid' });    // If there's an error verifying the token (e.g., it is invalid or expired), return a 403 Forbidden response.
            } 

            else
            {
                // If the token is good, add the user's data from the token to the request.
                req.user = user;
    
                // Proceed to the next function (Which are route handler functions use the "authenticateToken" middleware)
                next(); 
            }          
                
        });
    }
    
}

// Export the authenticateToken middleware 
module.exports = authenticateToken;
