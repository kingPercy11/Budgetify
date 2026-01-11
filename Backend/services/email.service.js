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
