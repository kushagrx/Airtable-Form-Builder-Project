const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');

// Route 1: Redirect user to Airtable's authorization screen
router.get('/airtable', (req, res) => {
    const authUrl = `https://airtable.com/oauth2/v1/authorize?client_id=${process.env.AIRTABLE_CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:5001/api/auth/airtable/callback')}&response_type=code&scope=data.records:read%20data.records:write%20schema.bases:read%20user.email:read`;
    res.redirect(authUrl);
});

// Route 2: Handle the callback from Airtable
router.get('/airtable/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const tokenResponse = await axios.post('https://airtable.com/oauth2/v1/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:5001/api/auth/airtable/callback',
            client_id: process.env.AIRTABLE_CLIENT_ID,
            client_secret: process.env.AIRTABLE_CLIENT_SECRET,
        });

        const { access_token, refresh_token } = tokenResponse.data;

        const userResponse = await axios.get('https://api.airtable.com/v0/meta/whoami', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { id: airtableUserId, email } = userResponse.data;

        const user = await User.findOneAndUpdate(
            { airtableUserId: airtableUserId },
            {
                $set: {
                    email: email,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                }
            },
            { new: true, upsert: true }
        );

        // Redirect to the frontend after successful login
        // For now, we'll just send a success message.
        res.send('Login successful! You can close this tab.');

    } catch (error) {
        if (error.response) {
            console.error('Airtable API Error Data:', error.response.data);
            console.error('Airtable API Error Status:', error.response.status);
            console.error('Airtable API Error Headers:', error.response.headers);
        } else if (error.request) {
            console.error('Airtable API Error Request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
        }
        res.status(500).send('Authentication failed. Check server logs for details.');
    }
});

module.exports = router;