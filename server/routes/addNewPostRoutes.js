const express = require('express')
const {query} = require('../helpers/db.js')
const authenticateToken = require('../middleware/authenticateToken.js')

//These are for image uploading
const fileUpload = require('express-fileupload');
const path = require('path');


const addNewPostRouter = express.Router()


/// Enable files upload
addNewPostRouter.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 15 * 1024 * 1024 }, // 5MB limit
}));

addNewPostRouter.post("/new", authenticateToken, async (req, res) => {
    try {

        console.log('Received title:', req.body.title);
        console.log('Received category name:', req.body.catName);
        console.log('Received content:', req.body.content);
        console.log('Received cover image path:', req.body.coverpic);

        //console.log(req.files);  // Debugging to check what files data is coming
        //console.log(req.body);   // Check other fields data


        // Check if the file was uploaded
        const coverImage = req.files ? req.files.coverpic : null;
        if (!coverImage) {
            return res.status(400).send('No cover image uploaded.');
        }

        
        // Define the upload path using the 'path' module for better handling
        const uploadPath = path.join(__dirname, '../public/images', coverImage.name);

        // Use the mv() method to place the file on the server
        coverImage.mv(uploadPath, async (err) => 
        {
            if (err) {
                return res.status(500).send(err);
            }

            // Store the path relative to the server root or a URL to the image
            const relativePath = path.join('images', coverImage.name);
            const sql = 'INSERT INTO posts (user_id, title, category_name, content, cover_image) VALUES ($1, $2, $3, $4, $5) returning *';
            const result = await query(sql, [req.user.userId, req.body.title, req.body.catName, req.body.content, relativePath]);
            res.status(200).json(result.rows[0]);
        });
    } catch (error) {
        console.error('Error is ', error);
        res.status(500).json({ message: 'Server error' });
    }
});




addNewPostRouter.delete("/delete/:id", async(req,res)=> {
    const id = Number(req.params.id)
    try {
        const sql ='delete from post where id = $1'
        await query(sql,[id])
        res.status(200).json({id:id})

    } catch(error){
        res.statusMessage = error
        res.status(500).json({error : error})
    }
})

module.exports = addNewPostRouter;