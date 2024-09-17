const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const authRoutes = require('./Routes/authRoutes.js');
const postRouters = require('./Routes/postRoutes.js');
const expRouters = require('./Routes/expRoutes.js'); 

require('./Config/passportConfig.js'); // Import passport strategies
const app = express();


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

//DATABASE CONNECTION
mongoose.connect(process.env.DB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.get('/',(req,res)=>{
    res.send("testing")
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRouters);
app.use('/api/experience', expRouters)


app.listen(process.env.PORT,()=>{
    console.log(`listening to port ${process.env.PORT}`)
});







