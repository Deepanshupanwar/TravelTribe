const express = require('express');
require('dotenv').config();

const cookieParser = require('cookie-parser');
const passport = require('passport');
const authRoutes = require('./Routes/authRoutes.js');

require('passportConfig'); // Import passport strategies
const app = express();


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.get('/',(req,res)=>{
    res.send("testing")
})

// Routes
app.use('/api/auth', authRoutes);


app.listen(process.env.PORT,()=>{
    console.log(`listening to port ${process.env.PORT}`)
});







