const axios = require('axios');

class TelegramService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Send a text message to a Telegram chat
   * @param {string} chatId - The chat ID to send the message to
   * @param {string} message - The message text to send
   * @returns {Promise} - Response from Telegram API
   */
  async sendMessage(chatId, message) {
    try {
      if (!this.botToken) {
        console.log('Telegram bot token is not configured. Skipping notification.');
        return null;
      }

      if (!chatId) {
        console.log('Chat ID not provided. Skipping notification.');
        return null;
      }

      const response = await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      });

      return response.data;
    } catch (error) {
      console.error('Telegram send message error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Send budget alert when limits are reached (80%, 90%, 100%, or exceeded)
   * @param {string} chatId - The chat ID
   * @param {object} alertData - Alert details
   */
  async sendBudgetAlert(chatId, alertData) {
    const { username, category, spent, limit, percentage, type, isOverspent } = alertData;
    
    // Determine alert level
    let status, alertMessage;
    
    if (percentage >= 100) {
      status = 'EXCEEDED';
      if (isOverspent && percentage > 100) {
        // If already overspent, show continuing overspend message
        alertMessage = `Budget exceeded! You are now ${(percentage - 100).toFixed(1)}% over your limit!`;
      } else {
        // First time exceeding or exactly at 100%
        alertMessage = 'You have exceeded your budget limit!';
      }
    } else if (percentage >= 90) {
      status = 'CRITICAL (90%)';
      alertMessage = 'You are at 90% of your budget limit!';
    } else if (percentage >= 80) {
      status = 'WARNING (80%)';
      alertMessage = 'You have reached 80% of your budget limit!';
    } else {
      // Don't send alerts below 80%
      return null;
    }

    // Determine limit type name
    const limitType = type === 'category' ? `${category} (Category)` :
                      type === 'monthly' ? 'Monthly Budget' :
                      type === 'weekly' ? 'Weekly Budget' :
                      type === 'daily' ? 'Daily Budget' : category;
    
    const overspentAmount = spent - limit;
    const overspentText = percentage >= 100 ? `\nOver by: ₹${overspentAmount.toFixed(0)}` : '';
    
    const message = `
<b>Budget Alert - ${status}</b>

User: ${username}
Limit: ${limitType}
Spent: ₹${spent.toFixed(0)}
Budget: ₹${limit.toFixed(0)}
Usage: ${percentage.toFixed(1)}%${overspentText}

${alertMessage}
    `.trim();

    return this.sendMessage(chatId, message);
  }
}

module.exports = new TelegramService();
