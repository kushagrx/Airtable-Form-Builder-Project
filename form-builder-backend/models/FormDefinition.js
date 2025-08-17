const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
    fieldId: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
}, { _id: false }); //

const FormDefinitionSchema = new mongoose.Schema({
    // Link to the user who created this form
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This references the 'User' model
        required: true,
    },
    formName: { type: String, required: true }, // A name for the form itself
    baseId: { type: String, required: true },
    tableId: { type: String, required: true },
    fields: [FieldSchema], // An array of question fields
    conditionalLogic: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('FormDefinition', FormDefinitionSchema);
