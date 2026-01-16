const limitService = require('./limit.service');
const telegramService = require('./telegram.service');
const emailService = require('./email.service');
const userModel = require('../models/user.model');

/**
 * Check limits and send alerts after an expense is added
 * @param {string} username - Username
 * @param {number} amount - Expense amount
 * @param {string} category - Expense category
 */
module.exports.checkAndSendAlerts = async (username, amount, category) => {
    try {
        // Get user details
        const user = await userModel.findOne({ username });
        if (!user) return;

        // Get current spending analysis
        const analysis = await limitService.getSpendingAnalysis(username);
        if (!analysis || !analysis.limits) return;

        const alerts = [];
        const previousThresholds = {};

        // Check category limit
        if (analysis.categoryAlerts && analysis.categoryAlerts[category]) {
            const categoryData = analysis.categoryAlerts[category];
            if (categoryData.limit > 0) {
                const previousSpent = categoryData.spent - amount;
                const previousPercentage = (previousSpent / categoryData.limit) * 100;
                
                // Check if we crossed 80%, 90%, or 100% threshold
                if (shouldSendAlert(previousPercentage, categoryData.percentage)) {
                    alerts.push({
                        username,
                        category,
                        spent: categoryData.spent,
                        limit: categoryData.limit,
                        percentage: categoryData.percentage,
                        type: 'category',
                        isOverspent: previousPercentage >= 100
                    });
                }
            }
        }

        // Check monthly budget
        if (analysis.monthly && analysis.monthly.budget > 0) {
            const previousSpent = analysis.monthly.totalSpent - amount;
            const previousPercentage = (previousSpent / analysis.monthly.budget) * 100;
            
            if (shouldSendAlert(previousPercentage, analysis.monthly.percentage)) {
                alerts.push({
                    username,
                    category: 'Monthly Budget',
                    spent: analysis.monthly.totalSpent,
                    limit: analysis.monthly.budget,
                    percentage: analysis.monthly.percentage,
                    type: 'monthly',
                    isOverspent: previousPercentage >= 100
                });
            }
        }

        // Check daily limit
        if (analysis.daily && analysis.daily.limit > 0) {
            const previousSpent = analysis.daily.spent - amount;
            const previousPercentage = (previousSpent / analysis.daily.limit) * 100;
            
            if (shouldSendAlert(previousPercentage, analysis.daily.percentage)) {
                alerts.push({
                    username,
                    category: 'Daily Limit',
                    spent: analysis.daily.spent,
                    limit: analysis.daily.limit,
                    percentage: analysis.daily.percentage,
                    type: 'daily',
                    isOverspent: previousPercentage >= 100
                });
            }
        }

        // Check weekly limit
        if (analysis.weekly && analysis.weekly.limit > 0) {
            const previousSpent = analysis.weekly.spent - amount;
            const previousPercentage = (previousSpent / analysis.weekly.limit) * 100;
            
            if (shouldSendAlert(previousPercentage, analysis.weekly.percentage)) {
                alerts.push({
                    username,
                    category: 'Weekly Limit',
                    spent: analysis.weekly.spent,
                    limit: analysis.weekly.limit,
                    percentage: analysis.weekly.percentage,
                    type: 'weekly',
                    isOverspent: previousPercentage >= 100
                });
            }
        }

        // Send all alerts
        for (const alert of alerts) {
            // Send Telegram alert if enabled
            if (user.enableTelegramAlerts && user.telegramChatId) {
                await telegramService.sendBudgetAlert(user.telegramChatId, alert);
            }

            // Send Email alert if enabled
            if (user.enableEmailAlerts && user.email) {
                await emailService.sendBudgetAlertEmail(user.email, alert);
            }
        }

        return alerts.length > 0;
    } catch (error) {
        console.error('Error checking and sending alerts:', error);
        return false;
    }
};

/**
 * Determine if an alert should be sent based on threshold crossing
 * @param {number} previousPercentage - Previous percentage
 * @param {number} currentPercentage - Current percentage
 * @returns {boolean} - Whether to send alert
 */
function shouldSendAlert(previousPercentage, currentPercentage) {
    // Send alert if:
    // 1. Crossed 80% threshold
    if (previousPercentage < 80 && currentPercentage >= 80) return true;
    
    // 2. Crossed 90% threshold
    if (previousPercentage < 90 && currentPercentage >= 90) return true;
    
    // 3. Crossed 100% threshold (first time)
    if (previousPercentage < 100 && currentPercentage >= 100) return true;
    
    // 4. Already over 100% (send on every expense)
    if (previousPercentage >= 100 && currentPercentage >= 100) return true;
    
    return false;
}
