const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;
const connectDB = require('./config/db');
const session = require('express-session');

connectDB();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
})
app.use(express.json());      //the default middleware
app.use('/api/auth',require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})