const TelegramBot = require('node-telegram-bot-api');
const userModel = require('../models/user.model');

class TelegramBotService {
  constructor() {
    this.bot = null;
    this.isInitialized = false;
  }

  initialize() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.log('Telegram bot token not configured. Bot will not start.');
      return;
    }

    try {
      this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
      this.setupHandlers();
      this.isInitialized = true;
      console.log('✅ Telegram bot started successfully');
    } catch (error) {
      console.error('Failed to start Telegram bot:', error.message);
    }
  }

  setupHandlers() {
    // Handle /start command
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from.username || msg.from.first_name;

      const welcomeMessage = `
👋 Welcome to Budgetify Alert Bot!

I'll send you budget alerts when you're approaching or exceeding your spending limits.

📱 To link your account:
1. Tap the button below to share your phone number
2. I'll automatically link it to your Budgetify account
3. Start receiving instant budget alerts!

Your phone number must match the one registered in Budgetify.
      `.trim();

      const options = {
        reply_markup: {
          keyboard: [
            [{
              text: '📱 Share Phone Number',
              request_contact: true
            }]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      };

      this.bot.sendMessage(chatId, welcomeMessage, options);
    });

    // Handle contact (phone number) sharing
    this.bot.on('contact', async (msg) => {
      const chatId = msg.chat.id;
      const phoneNumber = msg.contact.phone_number;
      
      try {
        // Normalize phone number (remove spaces, dashes, etc.)
        const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
        
        // Find user by phone number
        const user = await userModel.findOne({ 
          phoneNumber: { 
            $regex: normalizedPhone.slice(-10), // Match last 10 digits
            $options: 'i' 
          }
        });

        if (!user) {
          this.bot.sendMessage(
            chatId,
            `❌ No account found with phone number: ${phoneNumber}\n\n` +
            `Please make sure:\n` +
            `1. You're registered on Budgetify\n` +
            `2. Your phone number matches exactly\n\n` +
            `Need help? Contact support.`,
            { reply_markup: { remove_keyboard: true } }
          );
          return;
        }

        // Update user with chat ID and enable Telegram alerts
        user.telegramChatId = chatId.toString();
        user.enableTelegramAlerts = true;
        await user.save();

        this.bot.sendMessage(
          chatId,
          `✅ Account linked successfully!\n\n` +
          `👤 Username: ${user.username}\n` +
          `📧 Email: ${user.email}\n\n` +
          `🔔 You'll now receive budget alerts on Telegram!\n\n` +
          `You can disable alerts anytime in your Budgetify account settings.`,
          { reply_markup: { remove_keyboard: true } }
        );

        console.log(`✅ Linked Telegram account for user: ${user.username}`);
      } catch (error) {
        console.error('Error linking Telegram account:', error);
        this.bot.sendMessage(
          chatId,
          `❌ Something went wrong. Please try again later or contact support.`,
          { reply_markup: { remove_keyboard: true } }
        );
      }
    });

    // Handle /unlink command
    this.bot.onText(/\/unlink/, async (msg) => {
      const chatId = msg.chat.id;

      try {
        const user = await userModel.findOne({ telegramChatId: chatId.toString() });

        if (!user) {
          this.bot.sendMessage(chatId, '❌ No linked account found.');
          return;
        }

        user.telegramChatId = null;
        user.enableTelegramAlerts = false;
        await user.save();

        this.bot.sendMessage(
          chatId,
          `✅ Account unlinked successfully!\n\n` +
          `You'll no longer receive budget alerts on Telegram.\n\n` +
          `Send /start to link again.`
        );
      } catch (error) {
        console.error('Error unlinking account:', error);
        this.bot.sendMessage(chatId, '❌ Something went wrong. Please try again later.');
      }
    });

    // Handle /status command
    this.bot.onText(/\/status/, async (msg) => {
      const chatId = msg.chat.id;

      try {
        const user = await userModel.findOne({ telegramChatId: chatId.toString() });

        if (!user) {
          this.bot.sendMessage(
            chatId,
            `❌ No linked account found.\n\nSend /start to link your account.`
          );
          return;
        }

        const status = user.enableTelegramAlerts ? '🟢 Enabled' : '🔴 Disabled';
        this.bot.sendMessage(
          chatId,
          `📊 Account Status\n\n` +
          `👤 Username: ${user.username}\n` +
          `📧 Email: ${user.email}\n` +
          `🔔 Telegram Alerts: ${status}\n\n` +
          `Send /unlink to disconnect your account.`
        );
      } catch (error) {
        console.error('Error checking status:', error);
        this.bot.sendMessage(chatId, '❌ Something went wrong. Please try again later.');
      }
    });

    // Handle /help command
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const helpMessage = `
📚 Budgetify Bot Commands

/start - Link your account and start receiving alerts
/status - Check your account status
/unlink - Unlink your account
/help - Show this help message

🔔 You'll receive alerts when:
• 80% of any limit is reached
• 90% of any limit is reached
• 100% of any limit is exceeded
• Every expense after exceeding a limit

Need more help? Visit your Budgetify account settings.
      `.trim();

      this.bot.sendMessage(chatId, helpMessage);
    });

    // Handle any other messages
    this.bot.on('message', (msg) => {
      // Ignore messages that are already handled
      if (msg.text && (msg.text.startsWith('/') || msg.contact)) {
        return;
      }

      const chatId = msg.chat.id;
      this.bot.sendMessage(
        chatId,
        `👋 Hi! I'm the Budgetify Alert Bot.\n\n` +
        `Send /start to link your account and receive budget alerts.\n` +
        `Send /help to see all available commands.`
      );
    });
  }

  stop() {
    if (this.bot && this.isInitialized) {
      this.bot.stopPolling();
      console.log('Telegram bot stopped');
    }
  }
}

module.exports = new TelegramBotService();
