const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const expenditureRoutes = require('./routes/expenditure.routes');
dotenv.config();

const app = express();

connectToDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello P");
});

app.use('/users', userRoutes);
app.use('/expenditures', expenditureRoutes);

module.exports = app;
