const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;
const connectDB = require('./config/db');

connectDB();

app.use(express.json());      //the default middleware
app.use('/api/auth',require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})