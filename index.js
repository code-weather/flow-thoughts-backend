const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
require('dotenv').config();
const errorHandler = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes Middleware
app.use('/api/users', userRouter);

// Error Middleware
app.use(errorHandler);

// Connect to mongoDB and start server
mongoose.set('strictQuery', true);

const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Port ${PORT} is launched 🚀`);
    });
  })
  .catch((err) => console.log(err));
