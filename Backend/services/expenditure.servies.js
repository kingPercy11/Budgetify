const expenditureModel = require('../models/expenditure.model');

module.exports.addExpenditure = async ({username, amount, category, date, description}) => {
    if(!username || !amount || !category || !date){
        throw new Error('Required fields are missing');
    }
    const expenditure = await expenditureModel.create({
        username,
        amount,
        category,
        date,
        description
    });
    return expenditure;
}

module.exports.getUserExpenditures = async (username) => {
    if(!username){
        throw new Error('Username is required');
    }
    const expenditures = await expenditureModel.find({ username });
    return expenditures;
}

module.exports.deleteExpenditure = async (expenditureId) => {
    if(!expenditureId){
        throw new Error('Expenditure ID is required');
    }
    await expenditureModel.findByIdAndDelete(expenditureId);
    return;
}

module.exports.updateExpenditure = async (expenditureId, updateData) => {
    if(!expenditureId){
        throw new Error('Expenditure ID is required');
    }
    const expenditure = await expenditureModel.findByIdAndUpdate(expenditureId, updateData, { new: true });
    return expenditure;
}