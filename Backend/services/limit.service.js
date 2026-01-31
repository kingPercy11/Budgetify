const limitModel = require('../models/limit.model');
const expenditureModel = require('../models/expenditure.model');
const userModel = require('../models/user.model');

// Country to timezone offset mapping (in hours)
// Multi-timezone countries have separate entries matching frontend dropdown
const COUNTRY_TIMEZONE_OFFSETS = {
    // Single timezone countries
    'India': 5.5,
    'United Kingdom': 0,
    'Germany': 1,
    'France': 1,
    'Japan': 9,
    'China': 8,
    'Italy': 1,
    'Spain': 1,
    'South Korea': 9,
    'Singapore': 8,
    'UAE': 4,
    'South Africa': 2,
    'Netherlands': 1,
    'Sweden': 1,
    'Switzerland': 1,
    'Poland': 1,
    'Belgium': 1,
    'Norway': 1,
    'Austria': 1,
    'Denmark': 1,
    'Finland': 2,
    'Ireland': 0,
    'New Zealand': 12,
    'Portugal': 0,

    // USA - Multiple timezones
    'United States (Eastern, UTC-5)': -5,
    'United States (Central, UTC-6)': -6,
    'United States (Mountain, UTC-7)': -7,
    'United States (Pacific, UTC-8)': -8,
    'United States (Alaska, UTC-9)': -9,
    'United States (Hawaii, UTC-10)': -10,

    // Canada - Multiple timezones
    'Canada (Atlantic, UTC-4)': -4,
    'Canada (Eastern, UTC-5)': -5,
    'Canada (Central, UTC-6)': -6,
    'Canada (Mountain, UTC-7)': -7,
    'Canada (Pacific, UTC-8)': -8,

    // Australia - Multiple timezones
    'Australia (Eastern, UTC+10)': 10,
    'Australia (Central, UTC+9:30)': 9.5,
    'Australia (Western, UTC+8)': 8,

    // Russia - Multiple timezones
    'Russia (Moscow, UTC+3)': 3,
    'Russia (Yekaterinburg, UTC+5)': 5,
    'Russia (Novosibirsk, UTC+7)': 7,
    'Russia (Vladivostok, UTC+10)': 10,

    // Brazil - Multiple timezones
    'Brazil (Brasília, UTC-3)': -3,
    'Brazil (Amazon, UTC-4)': -4,
    'Brazil (Acre, UTC-5)': -5,

    // Mexico - Multiple timezones
    'Mexico (Central, UTC-6)': -6,
    'Mexico (Pacific, UTC-7)': -7,
    'Mexico (Northwest, UTC-8)': -8,

    // Indonesia - Multiple timezones
    'Indonesia (Western, UTC+7)': 7,
    'Indonesia (Central, UTC+8)': 8,
    'Indonesia (Eastern, UTC+9)': 9
};

// Get timezone offset for a user (in milliseconds)
const getTimezoneOffset = async (username) => {
    try {
        const user = await userModel.findOne({ username });
        if (user && user.country && COUNTRY_TIMEZONE_OFFSETS[user.country] !== undefined) {
            return COUNTRY_TIMEZONE_OFFSETS[user.country] * 60 * 60 * 1000;
        }
    } catch (error) {
        console.error('Error getting user timezone:', error);
    }
    // Default to GMT (0 offset)
    return 0;
};

// Helper function to get current date in user's timezone
const getUserDate = async (username) => {
    const offset = await getTimezoneOffset(username);
    const now = new Date();
    return new Date(now.getTime() + offset);
};

// Helper function to create date boundaries in user's timezone
const getDateBoundaries = async (username, type) => {
    const offset = await getTimezoneOffset(username);
    const userNow = await getUserDate(username);
    const year = userNow.getUTCFullYear();
    const month = userNow.getUTCMonth();
    const date = userNow.getUTCDate();
    const day = userNow.getUTCDay();

    if (type === 'month') {
        const startOfMonth = new Date(Date.UTC(year, month, 1) - offset);
        const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999) - offset);
        return { start: startOfMonth, end: endOfMonth };
    } else if (type === 'week') {
        const startOfWeek = new Date(Date.UTC(year, month, date - day, 0, 0, 0, 0) - offset);
        const endOfWeek = new Date(Date.UTC(year, month, date - day + 6, 23, 59, 59, 999) - offset);
        return { start: startOfWeek, end: endOfWeek };
    } else if (type === 'day') {
        const startOfDay = new Date(Date.UTC(year, month, date, 0, 0, 0, 0) - offset);
        const endOfDay = new Date(Date.UTC(year, month, date, 23, 59, 59, 999) - offset);
        return { start: startOfDay, end: endOfDay };
    }
};

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

// Calculate spending for current month (using user's timezone)
module.exports.getMonthlySpending = async (username) => {
    const { start: startOfMonth, end: endOfMonth } = await getDateBoundaries(username, 'month');

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

// Calculate spending for current week (using user's timezone)
module.exports.getWeeklySpending = async (username) => {
    const { start: startOfWeek, end: endOfWeek } = await getDateBoundaries(username, 'week');

    const expenses = await expenditureModel.find({
        username,
        type: 'debit',
        date: { $gte: startOfWeek, $lte: endOfWeek }
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return totalSpent;
};

// Calculate spending for today (using user's timezone)
module.exports.getDailySpending = async (username) => {
    const { start: startOfDay, end: endOfDay } = await getDateBoundaries(username, 'day');

    const expenses = await expenditureModel.find({
        username,
        type: 'debit',
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return totalSpent;
};

// Calculate total income for current month (using user's timezone)
module.exports.getMonthlyIncome = async (username) => {
    const { start: startOfMonth, end: endOfMonth } = await getDateBoundaries(username, 'month');

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
