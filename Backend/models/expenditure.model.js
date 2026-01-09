const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
    username: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    type: { type: String, enum: ['credit', 'debit'], required: true }
}, { timestamps: true });

const expenditureModel = mongoose.model('Expenditure', expenditureSchema);

module.exports = expenditureModel;