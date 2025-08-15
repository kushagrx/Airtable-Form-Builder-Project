const express = require('express');
const axios = require('axios');
const crypto = require('crypto'); // Built-in node module
const router = express.Router();
const User = require('../models/User');

const base64URLEncode = (str) => {
    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const sha256 = (buffer) => {
    return crypto.createHash('sha256').update(buffer).digest();
};

// Route 1: Redirect user to Airtable's authorization screen (with PKCE and state)
router.get('/airtable', (req, res) => {
    // Generate random values for security
    const state = crypto.randomBytes(16).toString('hex');
    const code_verifier = base64URLEncode(crypto.randomBytes(32));
    const code_challenge = base64URLEncode(sha256(code_verifier));

    // Store the verifier and state in the session to check later
    req.session.code_verifier = code_verifier;
    req.session.state = state;

    const authUrl = new URL('https://airtable.com/oauth2/v1/authorize');
    authUrl.searchParams.set('client_id', process.env.AIRTABLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', 'http://localhost:5001/api/auth/airtable/callback');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'data.records:read data.records:write schema.bases:read user.email:read');
    authUrl.searchParams.set('state', state); // <-- The missing 'state' parameter
    authUrl.searchParams.set('code_challenge', code_challenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    res.redirect(authUrl.toString());
});

// Route 2: Handle the callback from Airtable
router.get('/airtable/callback', async (req, res) => {
    const { code, state } = req.query;

    // --- Security Check ---
    // Verify that the 'state' matches what we stored in the session
    if (state !== req.session.state) {
        return res.status(400).send("State mismatch error. Potential CSRF attack.");
    }
    // --------------------

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', 'http://localhost:5001/api/auth/airtable/callback');
        params.append('client_id', process.env.AIRTABLE_CLIENT_ID);
        params.append('client_secret', process.env.AIRTABLE_CLIENT_SECRET);
        params.append('code_verifier', req.session.code_verifier); // <-- The required PKCE verifier

        const tokenResponse = await axios.post('https://airtable.com/oauth2/v1/token', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const { access_token, refresh_token } = tokenResponse.data;

        const userResponse = await axios.get('https://api.airtable.com/v0/meta/whoami', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { id: airtableUserId, email } = userResponse.data;

        const user = await User.findOneAndUpdate(
            { airtableUserId: airtableUserId },
            {
                $set: { // Using $set is better practice
                    email: email,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                }
            },
            { new: true, upsert: true }
        );

        res.send('Login successful! You can now close this tab.');

    } catch (error) {
        if (error.response) {
            console.error('Airtable API Error Data:', error.response.data);
            console.error('Airtable API Error Status:', error.response.status);
        } else {
            console.error('Error', error.message);
        }
        res.status(500).send('Authentication failed. Check server logs for details.');
    }
});

module.exports = router;