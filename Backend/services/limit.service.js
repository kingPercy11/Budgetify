const limitModel = require('../models/limit.model');
const expenditureModel = require('../models/expenditure.model');

// Create or get user limits
module.exports.createLimit = async ({ username, categoryLimits, monthlyBudget, dailyLimit, savingsGoal, weeklyLimit }) => {
    const limit = await limitModel.create({
        username,
        categoryLimits: categoryLimits || {},
        monthlyBudget: monthlyBudget || 0,
        dailyLimit: dailyLimit || 0,
        savingsGoal: savingsGoal || 0,
        weeklyLimit: weeklyLimit || 0
    });
    return limit;
};

// Get user limits
module.exports.getLimitByUsername = async (username) => {
    const limit = await limitModel.findOne({ username });
    return limit;
};

// Update user limits
module.exports.updateLimit = async (username, updateData) => {
    const limit = await limitModel.findOneAndUpdate(
        { username },
        updateData,
        { new: true, upsert: true }
    );
    return limit;
};

// Calculate spending for current month
module.exports.getMonthlySpending = async (username) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const expenses = await expenditureModel.find({
        username,
        type: 'debit',
        date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Calculate category-wise spending
    const categorySpending = {};
    expenses.forEach(exp => {
        if (!categorySpending[exp.category]) {
            categorySpending[exp.category] = 0;
        }
        categorySpending[exp.category] += exp.amount;
    });

    return { totalSpent, categorySpending, expenses };
};

// Calculate spending for current week
module.exports.getWeeklySpending = async (username) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    const expenses = await expenditureModel.find({
        username,
        type: 'debit',
        date: { $gte: startOfWeek, $lte: endOfWeek }
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return totalSpent;
};

// Calculate spending for today
module.exports.getDailySpending = async (username) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const expenses = await expenditureModel.find({
        username,
        type: 'debit',
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return totalSpent;
};

// Calculate total income for current month
module.exports.getMonthlyIncome = async (username) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const income = await expenditureModel.find({
        username,
        type: 'credit',
        date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalIncome = income.reduce((sum, inc) => inc.amount + sum, 0);
    return totalIncome;
};

// Get complete spending analysis
module.exports.getSpendingAnalysis = async (username) => {
    const limits = await limitModel.findOne({ username });
    const monthlyData = await this.getMonthlySpending(username);
    const weeklySpending = await this.getWeeklySpending(username);
    const dailySpending = await this.getDailySpending(username);
    const monthlyIncome = await this.getMonthlyIncome(username);

    // Calculate savings
    const actualSavings = monthlyIncome - monthlyData.totalSpent;

    // Calculate alerts for each category
    const categoryAlerts = {};
    if (limits && limits.categoryLimits) {
        Object.keys(limits.categoryLimits).forEach(category => {
            const limit = limits.categoryLimits[category];
            const spent = monthlyData.categorySpending[category] || 0;
            
            if (limit > 0) {
                const percentage = (spent / limit) * 100;
                let status = 'safe';
                if (percentage >= 100) status = 'exceeded';
                else if (percentage >= 90) status = 'critical';
                else if (percentage >= 80) status = 'warning';
                
                categoryAlerts[category] = {
                    limit,
                    spent,
                    remaining: Math.max(0, limit - spent),
                    percentage: Math.min(100, percentage),
                    status
                };
            }
        });
    }

    return {
        limits: limits || null,
        monthly: {
            totalSpent: monthlyData.totalSpent,
            totalIncome: monthlyIncome,
            budget: limits?.monthlyBudget || 0,
            remaining: limits?.monthlyBudget ? Math.max(0, limits.monthlyBudget - monthlyData.totalSpent) : 0,
            percentage: limits?.monthlyBudget ? Math.min(100, (monthlyData.totalSpent / limits.monthlyBudget) * 100) : 0
        },
        weekly: {
            spent: weeklySpending,
            limit: limits?.weeklyLimit || 0,
            remaining: limits?.weeklyLimit ? Math.max(0, limits.weeklyLimit - weeklySpending) : 0,
            percentage: limits?.weeklyLimit ? Math.min(100, (weeklySpending / limits.weeklyLimit) * 100) : 0
        },
        daily: {
            spent: dailySpending,
            limit: limits?.dailyLimit || 0,
            remaining: limits?.dailyLimit ? Math.max(0, limits.dailyLimit - dailySpending) : 0,
            percentage: limits?.dailyLimit ? Math.min(100, (dailySpending / limits.dailyLimit) * 100) : 0
        },
        savings: {
            actual: actualSavings,
            goal: limits?.savingsGoal || 0,
            remaining: limits?.savingsGoal ? Math.max(0, limits.savingsGoal - actualSavings) : 0,
            percentage: limits?.savingsGoal ? Math.min(100, (actualSavings / limits.savingsGoal) * 100) : 0
        },
        categoryAlerts,
        categorySpending: monthlyData.categorySpending
    };
};
