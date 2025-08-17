const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
console.log(`Verifying Airtable Client ID: ${process.env.AIRTABLE_CLIENT_ID ? 'Loaded' : 'Not Loaded'}`);

const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');

connectDB();
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/airtable', require('./routes/airtable'));

app.get('/', (req, res) => {
    res.send('Welcome to the Form Builder server!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});