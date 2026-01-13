const limitService = require('../services/limit.service');
const { validationResult } = require('express-validator');

// Get user limits and spending analysis
module.exports.getLimits = async (req, res, next) => {
    try {
        const username = req.user.username;
        const analysis = await limitService.getSpendingAnalysis(username);
        
        res.status(200).json(analysis);
    } catch (error) {
        console.error('Get limits error:', error);
        res.status(500).json({ message: 'Error fetching limits', error: error.message });
    }
};

// Update user limits
module.exports.updateLimits = async (req, res, next) => {
    try {
        const username = req.user.username;
        const { categoryLimits, monthlyBudget, dailyLimit, savingsGoal, weeklyLimit } = req.body;
        
        // Prepare update data
        const updateData = {};
        
        if (categoryLimits !== undefined) {
            updateData.categoryLimits = categoryLimits;
        }
        if (monthlyBudget !== undefined) {
            updateData.monthlyBudget = Math.max(0, monthlyBudget);
        }
        if (dailyLimit !== undefined) {
            updateData.dailyLimit = Math.max(0, dailyLimit);
        }
        if (savingsGoal !== undefined) {
            updateData.savingsGoal = Math.max(0, savingsGoal);
        }
        if (weeklyLimit !== undefined) {
            updateData.weeklyLimit = Math.max(0, weeklyLimit);
        }
        
        const updatedLimit = await limitService.updateLimit(username, updateData);
        
        res.status(200).json({ 
            message: 'Limits updated successfully', 
            limits: updatedLimit 
        });
    } catch (error) {
        console.error('Update limits error:', error);
        res.status(500).json({ message: 'Error updating limits', error: error.message });
    }
};

// Update specific category limit
module.exports.updateCategoryLimit = async (req, res, next) => {
    try {
        const username = req.user.username;
        const { category, amount } = req.body;
        
        if (!category || amount === undefined) {
            return res.status(400).json({ message: 'Category and amount are required' });
        }
        
        const validCategories = ['food', 'transport', 'shopping', 'entertainment', 'bills', 'healthcare', 'education', 'other'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        
        // Get current limits
        let limits = await limitService.getLimitByUsername(username);
        
        if (!limits) {
            // Create new limits if they don't exist
            limits = await limitService.createLimit({ 
                username,
                categoryLimits: { [category]: Math.max(0, amount) }
            });
        } else {
            // Update specific category
            const updateData = { 
                [`categoryLimits.${category}`]: Math.max(0, amount) 
            };
            limits = await limitService.updateLimit(username, updateData);
        }
        
        res.status(200).json({ 
            message: `${category} limit updated successfully`, 
            limits 
        });
    } catch (error) {
        console.error('Update category limit error:', error);
        res.status(500).json({ message: 'Error updating category limit', error: error.message });
    }
};

// Get spending progress
module.exports.getSpendingProgress = async (req, res, next) => {
    try {
        const username = req.user.username;
        const analysis = await limitService.getSpendingAnalysis(username);
        
        // Return simplified progress data
        const progress = {
            monthly: {
                spent: analysis.monthly.totalSpent,
                limit: analysis.monthly.budget,
                percentage: analysis.monthly.percentage,
                remaining: analysis.monthly.remaining
            },
            weekly: {
                spent: analysis.weekly.spent,
                limit: analysis.weekly.limit,
                percentage: analysis.weekly.percentage,
                remaining: analysis.weekly.remaining
            },
            daily: {
                spent: analysis.daily.spent,
                limit: analysis.daily.limit,
                percentage: analysis.daily.percentage,
                remaining: analysis.daily.remaining
            },
            savings: {
                actual: analysis.savings.actual,
                goal: analysis.savings.goal,
                percentage: analysis.savings.percentage,
                remaining: analysis.savings.remaining
            },
            categories: analysis.categoryAlerts
        };
        
        res.status(200).json(progress);
    } catch (error) {
        console.error('Get spending progress error:', error);
        res.status(500).json({ message: 'Error fetching spending progress', error: error.message });
    }
};

// Reset all limits
module.exports.resetLimits = async (req, res, next) => {
    try {
        const username = req.user.username;
        
        const resetData = {
            categoryLimits: {
                food: 0,
                transport: 0,
                shopping: 0,
                entertainment: 0,
                bills: 0,
                healthcare: 0,
                education: 0,
                other: 0
            },
            monthlyBudget: 0,
            dailyLimit: 0,
            savingsGoal: 0,
            weeklyLimit: 0
        };
        
        const updatedLimit = await limitService.updateLimit(username, resetData);
        
        res.status(200).json({ 
            message: 'All limits reset successfully', 
            limits: updatedLimit 
        });
    } catch (error) {
        console.error('Reset limits error:', error);
        res.status(500).json({ message: 'Error resetting limits', error: error.message });
    }
};
