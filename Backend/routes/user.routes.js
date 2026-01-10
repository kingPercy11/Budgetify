const express  = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.loginUser);   

router.get('/profile', authMiddleware.authUser , userController.getUserProfile)
router.get('/logout', authMiddleware.authUser , userController.logoutUser)
router.put('/update-username', authMiddleware.authUser, [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
], userController.updateUsername)
router.put('/update-email', authMiddleware.authUser, [
    body('email').isEmail().withMessage('Invalid Email')
], userController.updateEmail)
router.put('/update-password', authMiddleware.authUser, [
    body('currentPassword').isLength({ min: 6 }).withMessage('Current password must be at least 6 characters long'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], userController.updatePassword)

router.post('/forgot-password', [
    body('email').isEmail().withMessage('Invalid Email')
], userController.forgotPassword)

router.post('/reset-password', [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], userController.resetPassword)

module.exports = router;