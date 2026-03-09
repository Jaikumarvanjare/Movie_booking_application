const express= require('express');
const env= require('dotenv').config();
const mongoose = require('mongoose');

const movieRoutes = require('./routes/movie.routes');
const theatreRoutes = require('./routes/theatre.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');


const app= express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

mongoose.set('debug', true);    

movieRoutes(app);
theatreRoutes(app);
authRoutes(app);
userRoutes(app);

const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on http://localhost:${process.env.PORT}`);
        });

    } catch (err) {
        console.log("Not able to connect to MongoDB", err);
        process.exit(1);
    }
};

startServer();