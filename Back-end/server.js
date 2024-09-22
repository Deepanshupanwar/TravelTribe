const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const authRoutes = require('./Routes/authRoutes.js');
const postRouters = require('./Routes/postRoutes.js');
const expRouters = require('./Routes/expRoutes.js'); 

const session = require('express-session');

require('./Config/passportConfig.js'); // Import passport strategies
const app = express();


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Add session middleware
app.use(session({
    secret: 'your-secret-key',  // Replace with a secure key
    resave: false,              // Don't save session if nothing is modified
    saveUninitialized: false,   // Don't create session until something is stored
    cookie: {                   // Cookie settings for session
      maxAge: 1000 * 60 * 60 * 24 // 24 hours (adjust as needed)
    }
  }));

app.use(passport.session()); 

//DATABASE CONNECTION
mongoose.connect(process.env.DB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.get('/',(req,res)=>{
    res.send("testing")
})
app.get('/home',(req,res)=>{
  res.send("redirected to HOME its homing")
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRouters);
app.use('/api/experience', expRouters)


app.listen(process.env.PORT,()=>{
    console.log(`listening to port ${process.env.PORT}`)
});
// https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=295925589376-m51jed0pabqoodsj8hdllu8oifqipap4.apps.googleusercontent.com&redirect_uri=http://localhost:4000/api/auth/google/callback&scope=profile email&access_type=offline
