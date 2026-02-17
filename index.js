const express= require('express');
const bodyParser = require('body-parser');
const env= require('dotenv');
const mongoose = require('mongoose');

env.config();
const app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.get('/home', (req,res)=>{
    console.log("hitting /Home");
    return res.json({
        success:true,
        message:"fetched home"
    })
})

app.listen(process.env.PORT, async() => {
    console.log(`server running on http://localhost:${process.env.PORT}`);

    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.log("Not able to connect to MongoDB", err);
        });
});
