const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/User');

const base64URLEncode = (str) => {
    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const sha256 = (buffer) => {
    return crypto.createHash('sha256').update(buffer).digest();
};

router.get('/airtable', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    const code_verifier = base64URLEncode(crypto.randomBytes(32));
    const code_challenge = base64URLEncode(sha256(code_verifier));

    req.session.code_verifier = code_verifier;
    req.session.state = state;

    const authUrl = new URL('https://airtable.com/oauth2/v1/authorize');
    authUrl.searchParams.set('client_id', process.env.AIRTABLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', 'http://localhost:5001/api/auth/airtable/callback');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'data.records:read data.records:write schema.bases:read user.email:read');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', code_challenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    res.redirect(authUrl.toString());
});

router.get('/airtable/callback', async (req, res) => {
    const { code, state } = req.query;

    if (state !== req.session.state) {
        return res.status(400).send("State mismatch error. Potential CSRF attack.");
    }

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', 'http://localhost:5001/api/auth/airtable/callback');
        params.append('client_id', process.env.AIRTABLE_CLIENT_ID);
        params.append('client_secret', process.env.AIRTABLE_CLIENT_SECRET);
        params.append('code_verifier', req.session.code_verifier);

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
                $set: {
                    email: email,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                }
            },
            { new: true, upsert: true }
        );
        req.session.userId = user._id;

        res.redirect('http://localhost:3000/builder');

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