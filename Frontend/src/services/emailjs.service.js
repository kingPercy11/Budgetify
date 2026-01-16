import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    templates: {
        passwordReset: import.meta.env.VITE_EMAILJS_PASSWORD_RESET_TEMPLATE || 'password_reset_template',
        budgetAlert: import.meta.env.VITE_EMAILJS_BUDGET_ALERT_TEMPLATE || 'budget_alert_template'
    }
};

/**
 * Initialize EmailJS with public key
 */
export const initializeEmailJS = () => {
    if (EMAILJS_CONFIG.publicKey) {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
};

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's name (optional)
 * @returns {Promise} - EmailJS promise
 */
export const sendPasswordResetEmail = async (email, resetToken, userName = '') => {
    try {
        const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;
        
        const templateParams = {
            to_email: email,
            email: email,  // Added for compatibility
            to_name: userName || email.split('@')[0],
            reset_link: resetLink,
            app_name: 'Budgetify',
            expires_in: '1 hour'
        };

        console.log('Sending email with params:', {
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templates.passwordReset,
            to_email: email
        });

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templates.passwordReset,
            templateParams,
            EMAILJS_CONFIG.publicKey
        );

        console.log('Password reset email sent successfully:', response);
        return {
            success: true,
            message: 'Password reset email sent successfully'
        };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        console.error('EmailJS config:', {
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templates.passwordReset,
            publicKey: EMAILJS_CONFIG.publicKey?.substring(0, 10) + '...'
        });
        throw new Error(`Failed to send email: ${error.text || error.message}`);
    }
};

/**
 * Validate EmailJS configuration
 * @returns {boolean} - True if configured correctly
 */
export const isEmailJSConfigured = () => {
    const isConfigured = !!(
        EMAILJS_CONFIG.serviceId && 
        EMAILJS_CONFIG.publicKey && 
        EMAILJS_CONFIG.templates.passwordReset
    );
    
    if (!isConfigured) {
        console.warn('EmailJS not properly configured. Please check environment variables:');
        console.warn('- VITE_EMAILJS_SERVICE_ID');
        console.warn('- VITE_EMAILJS_PUBLIC_KEY');
        console.warn('- VITE_EMAILJS_PASSWORD_RESET_TEMPLATE');
    }
    
    return isConfigured;
};

/**
 * Send budget alert email
 * @param {string} email - Recipient email address
 * @param {object} alertData - Alert data object
 * @returns {Promise} - EmailJS promise
 */
export const sendBudgetAlertEmail = async (email, alertData) => {
    try {
        const { username, category, spent, limit, percentage, type, isOverspent } = alertData;
        
        // Determine alert level and color
        let alertLevel, alertColor;
        if (percentage >= 100) {
            alertLevel = isOverspent && percentage > 100 ? `EXCEEDED (${percentage.toFixed(1)}%)` : 'EXCEEDED (100%)';
            alertColor = '#dc2626'; // red
        } else if (percentage >= 90) {
            alertLevel = 'CRITICAL (90%)';
            alertColor = '#f97316'; // orange
        } else if (percentage >= 80) {
            alertLevel = 'WARNING (80%)';
            alertColor = '#eab308'; // yellow
        } else {
            return null; // Don't send if below 80%
        }
        
        // Format limit type
        const limitType = type === 'category' ? `${category} (Category)` :
                          type === 'monthly' ? 'Monthly Budget' :
                          type === 'weekly' ? 'Weekly Budget' :
                          type === 'daily' ? 'Daily Budget' : category;
        
        const overspentAmount = spent - limit;
        
        const templateParams = {
            to_email: email,
            email: email,  // Added for compatibility
            to_name: username,
            alert_level: alertLevel,
            alert_color: alertColor,
            limit_type: limitType,
            spent_amount: Math.round(spent),
            limit_amount: Math.round(limit),
            percentage: percentage.toFixed(1),
            overspent_amount: percentage >= 100 ? Math.round(overspentAmount) : 0,
            is_overspent: percentage >= 100 ? 'yes' : 'no',
            app_name: 'Budgetify',
            frontend_url: window.location.origin
        };

        console.log('Sending budget alert email:', {
            to: email,
            alertLevel,
            percentage: percentage.toFixed(1)
        });

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templates.budgetAlert,
            templateParams,
            EMAILJS_CONFIG.publicKey
        );

        console.log('Budget alert email sent successfully:', response);
        return {
            success: true,
            message: 'Budget alert email sent successfully'
        };
    } catch (error) {
        console.error('Error sending budget alert email:', error);
        // Don't throw error to avoid blocking the expense addition
        return null;
    }
};

