const userModel = require('../models/user.model');
const crypto = require('crypto');

module.exports.createUser = async ({username,email,password}) => {
    if(!username || !email || !password){
        throw new Error('All fields are required');
    }
    const user = await userModel.create({
        username,
        email,
        password   
    });
    return user;
}

// Generate password reset token
module.exports.generatePasswordResetToken = async (email) => {
    const user = await userModel.findOne({ email });
    
    if (!user) {
        throw new Error('User not found');
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // Set expire time (1 hour)
    user.resetPasswordExpires = Date.now() + 3600000;
    
    await user.save();
    
    return { resetToken, username: user.username };
};

// Reset password
module.exports.resetPassword = async (token, newPassword) => {
    // Hash the token to compare with stored hash
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    
    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
        throw new Error('Invalid or expired token');
    }
    
    // Hash new password
    const hashedPassword = await userModel.hashPassword(newPassword);
    
    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    return user;
};


