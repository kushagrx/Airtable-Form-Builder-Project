const express = require('express');
const router = express.Router();
const FormDefinition = require('../models/FormDefinition');
const User = require('../models/User');

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ message: 'User not authenticated. Please log in.' });
};

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { formName, baseId, tableId, fields, conditionalLogic } = req.body;
        const userId = req.session.userId;

        // Basic validation
        if (!formName || !baseId || !tableId || !fields || !Array.isArray(fields) || fields.length === 0) {
            return res.status(400).json({ message: 'Missing required form data: formName, baseId, tableId, and fields are required.' });
        }

        const newForm = new FormDefinition({
            userId,
            formName,
            baseId,
            tableId,
            fields,
            conditionalLogic,
        });

        await newForm.save();

        res.status(201).json({ message: 'Form configuration saved successfully!', formId: newForm._id });
    } catch (err) {
        console.error('Error saving form definition:', err);
        res.status(500).json({ message: 'Server error while saving form.' });
    }
});

module.exports = router;
