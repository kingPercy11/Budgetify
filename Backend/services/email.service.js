const nodemailer = require('nodemailer');

// Debug: Check if environment variables are loaded
console.log('Email Config:', {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    passLength: process.env.EMAIL_PASSWORD?.length || 0
});

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send password reset email
module.exports.sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request - Budgetify',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password for your Budgetify account.</p>
                <p>Please click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, please ignore this email.</p>
                <hr style="border: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">This is an automated email. Please do not reply.</p>
            </div>
        `
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Detailed email error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

// Send password reset confirmation email
module.exports.sendPasswordResetConfirmation = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Successful - Budgetify',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Successful</h2>
                <p>Your password has been successfully reset.</p>
                <p>You can now login with your new password.</p>
                <p>If you didn't make this change, please contact support immediately.</p>
                <hr style="border: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">This is an automated email. Please do not reply.</p>
            </div>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

// Send budget alert email
module.exports.sendBudgetAlertEmail = async (email, alertData) => {
    const { username, category, spent, limit, percentage, type, isOverspent } = alertData;
    
    let alertLevel, alertColor, alertMessage;
    
    if (percentage >= 100) {
        alertLevel = 'EXCEEDED';
        alertColor = '#dc2626';
        if (isOverspent && percentage > 100) {
            alertMessage = `Budget exceeded! You are now ${(percentage - 100).toFixed(1)}% over your limit!`;
        } else {
            alertMessage = 'You have exceeded your budget limit!';
        }
    } else if (percentage >= 90) {
        alertLevel = 'CRITICAL (90%)';
        alertColor = '#f97316';
        alertMessage = 'You are at 90% of your budget limit!';
    } else if (percentage >= 80) {
        alertLevel = 'WARNING (80%)';
        alertColor = '#eab308';
        alertMessage = 'You have reached 80% of your budget limit!';
    } else {
        return null;
    }
    
    const limitType = type === 'category' ? `${category} (Category)` :
                      type === 'monthly' ? 'Monthly Budget' :
                      type === 'weekly' ? 'Weekly Budget' :
                      type === 'daily' ? 'Daily Budget' : category;
    
    const overspentAmount = spent - limit;
    const overspentRow = percentage >= 100 ? `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Over by:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #dc2626;">₹${overspentAmount.toFixed(0)}</td>
        </tr>
    ` : '';
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Budget Alert - ${alertLevel} - Budgetify`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: ${alertColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h2 style="margin: 0;">Budget Alert - ${alertLevel}</h2>
                </div>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px;">
                    <p>Hi ${username},</p>
                    <p style="font-size: 16px; color: #374151;">${alertMessage}</p>
                    
                    <table style="width: 100%; margin: 20px 0; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Limit:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${limitType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Spent:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${spent.toFixed(0)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Budget:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${limit.toFixed(0)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Usage:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                                <span style="color: ${alertColor}; font-weight: bold;">${percentage.toFixed(1)}%</span>
                            </td>
                        </tr>${overspentRow}
                    </table>
                    
                    <div style="background-color: #fef3c7; border-left: 4px solid ${alertColor}; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #92400e;"><strong>Tip:</strong> Review your expenses and adjust your spending to stay within budget.</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL}/limits" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Manage Your Limits</a>
                    </div>
                </div>
                <hr style="border: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">This is an automated alert from Budgetify. You can disable alerts in your account settings.</p>
            </div>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Budget alert email sent successfully');
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending budget alert email:', error);
        return null;
    }
};
