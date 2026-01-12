const blacklistTokenModel = require('../models/blacklistToken.model');
const userModel = require('../models/user.model'); 
const userService = require('../services/user.services');
const emailService = require('../services/email.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        username,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
}

module.exports.loginUser = async(req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');

    if(!user){
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, user });
}

module.exports.getUserProfile = async(req,res,next) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser = async(req,res,next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    await blackListTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out successfully' });
}

module.exports.updateUsername = async(req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { username } = req.body;
        const userId = req.user._id;
        
        // Check if username is already taken
        const existingUser = await userModel.findOne({ username, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        
        const user = await userModel.findByIdAndUpdate(
            userId,
            { username },
            { new: true }
        ).select('-password');
        
        res.status(200).json({ message: 'Username updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.updateProfile = async(req,res,next) => {
    try {
        const { age, state, country, phoneNumber } = req.body;
        const userId = req.user._id;
        
        // Validate required field
        if (!phoneNumber || phoneNumber.trim() === '') {
            return res.status(400).json({ message: 'Phone number is required' });
        }
        
        const updateData = {};
        if (age !== undefined) updateData.age = age;
        if (state !== undefined) updateData.state = state;
        if (country !== undefined) updateData.country = country;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        
        const user = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');
        
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.updateEmail = async(req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { email } = req.body;
        const userId = req.user._id;
        
        // Check if email is already taken
        const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already taken' });
        }
        
        const user = await userModel.findByIdAndUpdate(
            userId,
            { email },
            { new: true }
        ).select('-password');
        
        res.status(200).json({ message: 'Email updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.updatePassword = async(req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;
        
        const user = await userModel.findById(userId).select('+password');
        
        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        
        // Hash new password
        const hashedPassword = await userModel.hashPassword(newPassword);
        
        // Update password
        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.forgotPassword = async(req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { email } = req.body;
        
        // Generate reset token
        const resetToken = await userService.generatePasswordResetToken(email);
        
        // Send email with reset token
        await emailService.sendPasswordResetEmail(email, resetToken);
        
        res.status(200).json({ 
            message: 'Password reset link has been sent to your email' 
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        if (error.message === 'User not found') {
            // Don't reveal if user exists or not for security
            return res.status(200).json({ 
                message: 'If an account exists with this email, a password reset link will be sent' 
            });
        }
        res.status(500).json({ message: 'Error sending reset email. Please try again later.', error: error.message });
    }
}

module.exports.resetPassword = async(req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { token, newPassword } = req.body;
        
        // Reset password
        const user = await userService.resetPassword(token, newPassword);
        
        // Send confirmation email
        await emailService.sendPasswordResetConfirmation(user.email);
        
        res.status(200).json({ 
            message: 'Password has been reset successfully. You can now login with your new password.' 
        });
    } catch (error) {
        if (error.message === 'Invalid or expired token') {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        res.status(500).json({ message: 'Error resetting password. Please try again later.' });
    }
}

