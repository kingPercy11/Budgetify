const mongoose = require('mongoose');

const limitSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        ref: 'user'
    },
    // Category-wise Monthly Limits
    categoryLimits: {
        food: { type: Number, default: null },
        transport: { type: Number, default: null },
        shopping: { type: Number, default: null },
        entertainment: { type: Number, default: null },
        bills: { type: Number, default: null },
        healthcare: { type: Number, default: null },
        education: { type: Number, default: null },
        other: { type: Number, default: null }
    },
    // Overall Monthly Budget Limit
    monthlyBudget: {
        type: Number,
        default: null,
        min: 0
    },
    // Daily Spending Limit
    dailyLimit: {
        type: Number,
        default: null,
        min: 0
    },
    // Monthly Savings Goal
    savingsGoal: {
        type: Number,
        default: null,
        min: 0
    },
    // Weekly Budget Limit
    weeklyLimit: {
        type: Number,
        default: null,
        min: 0
    }
}, {
    timestamps: true
});

const limitModel = mongoose.model('Limit', limitSchema);

module.exports = limitModel;
