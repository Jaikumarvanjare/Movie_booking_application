const express= require('express');
const env= require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const MovieRoutes = require('./routes/movie.routes');

const app= express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

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

        // await movie.create({
        //     name: "Inception",
        //     description: "A thief who steals corporate secrets through dream-sharing technology.",
        //     casts: "Leonardo DiCaprio, Joseph Gordon-Levitt",
        //     releaseDate: "2010",
        //     director: "Christopher Nolan"
        // });

        // console.log("Movie inserted");
    })
    .catch((err) => {
        console.log("Not able to connect to MongoDB", err);
    });
});
