//Importing Modules
const express = require('express');
const contactusRouter = express.Router();

const { query} = require('../helpers/db.js');

//const jwt = require('jsonwbtoken');
contactusRouter.post('/contactus',async(req,res) => {
    try {
        const sql = "insert into contact_us (name,contact_number,email,comments) values ($1,$2,$3,$4) returning contact_us_id";
        const result = await query(sql,[req.body.fullname,req.body.contactnumber,req.body.email,req.body.message]);
        res.status(200).json({contact_us_id: result.rows[0].contact_us_id});
    } catch (error) {
        res.statusMessage = error;
        res.status(500).json({error: error});
    }
})


module.exports = contactusRouter;
    
