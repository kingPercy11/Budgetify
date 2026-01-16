const expenditureController = require('../controllers/expenditure.controller');
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const alertService = require('../services/alert.service');

router.post('/add', authMiddleware.authUser, [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').isISO8601().toDate().withMessage('Invalid date format'),
    body('type').isIn(['credit', 'debit']).withMessage('Type must be either credit or debit')
], async (req, res) => {
    try {
        const { username } = req.user;
        const { amount, category, date, description, type } = req.body;
        
        // Add expenditure first
        const expenditure = await expenditureController.addExpenditure({ username, amount, category, date, description, type });
        
        // Send response immediately
        res.status(201).json(expenditure);
        
        // Check limits and send alerts asynchronously for expenses (debit) - non-blocking
        if (type === 'debit') {
            alertService.checkAndSendAlerts(username, amount, category).catch(error => {
                console.error('Error checking alerts:', error);
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/user/:username', authMiddleware.authUser, async (req, res) => {
    try {
        const { username } = req.params;    
        const expenditures = await expenditureController.getExpendituresByUser(username);
        res.status(200).json(expenditures);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/delete/:id', authMiddleware.authUser,  async (req, res) => {
    try {
        const { id } = req.params;
        await expenditureController.deleteExpenditure(id);
        res.status(200).json({ message: 'Expenditure deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/update/:id', authMiddleware.authUser, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedExpenditure = await expenditureController.updateExpenditure(id, updateData);
        res.status(200).json(updatedExpenditure);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;