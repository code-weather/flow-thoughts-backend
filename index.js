const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRouter);

const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Port ${PORT} is launched 🚀`);
    });
  })
  .catch((err) => console.log(err));
