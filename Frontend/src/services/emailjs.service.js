import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    templates: {
        passwordReset: import.meta.env.VITE_EMAILJS_PASSWORD_RESET_TEMPLATE || 'password_reset_template'
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
