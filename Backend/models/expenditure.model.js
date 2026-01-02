const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
    username: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String }
}, { timestamps: true });

const expenditureModel = mongoose.model('Expenditure', expenditureSchema);

module.exports = expenditureModel;