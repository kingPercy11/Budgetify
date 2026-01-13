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
        food: { type: Number, default: 0 },
        transport: { type: Number, default: 0 },
        shopping: { type: Number, default: 0 },
        entertainment: { type: Number, default: 0 },
        bills: { type: Number, default: 0 },
        healthcare: { type: Number, default: 0 },
        education: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    // Overall Monthly Budget Limit
    monthlyBudget: { 
        type: Number, 
        default: 0,
        min: 0
    },
    // Daily Spending Limit
    dailyLimit: { 
        type: Number, 
        default: 0,
        min: 0
    },
    // Monthly Savings Goal
    savingsGoal: { 
        type: Number, 
        default: 0,
        min: 0
    },
    // Weekly Budget Limit
    weeklyLimit: { 
        type: Number, 
        default: 0,
        min: 0
    }
}, { 
    timestamps: true 
});

const limitModel = mongoose.model('Limit', limitSchema);

module.exports = limitModel;
