// Import Express and create express app
import express from 'express';
const app = express();

// Import dotenv and call config function
import dotenv from 'dotenv';
dotenv.config();

// Import MongoDB Connection Funtion and call It here
import connectDB from './config/database.js';
connectDB();


// Routes Definition
// Import userRoute and use in default URL
import userRoute from './modules/user/route/userRoute.js';
app.use('/', userRoute);

// Import userPortfolioRoute and use 
import userPortfolioRoute from './modules/user/route/userPortfolioRoute.js';
app.use('/portfolio', userPortfolioRoute);








// create server with port number
app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT : ${process.env.PORT}`);
});