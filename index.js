const express= require('express');
const env= require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app= express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const MovieRoutes = require('./routes/movie.routes');
MovieRoutes(app);

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
    .then(async () => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Not able to connect to MongoDB", err);
    });
});
