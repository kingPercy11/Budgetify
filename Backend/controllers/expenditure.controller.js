const expenditureService = require('../services/expenditure.servies');

module.exports.addExpenditure = async ({username, amount, category, date, description, type}) => {
    const expenditure = await expenditureService.addExpenditure({
        username,
        amount,
        category,
        date,
        description,
        type
    });
    return expenditure;
}

module.exports.getExpendituresByUser = async (username) => {
    const expenditures = await expenditureService.getUserExpenditures(username);
    return expenditures;
}

module.exports.deleteExpenditure = async (expenditureId) => {
    await expenditureService.deleteExpenditure(expenditureId);
    return;
}

module.exports.updateExpenditure = async (expenditureId, updateData) => {
    const expenditure = await expenditureService.updateExpenditure(expenditureId, updateData);
    return expenditure;
}