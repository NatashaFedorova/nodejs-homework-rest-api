const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const contactsRouter = require('./routes/contactsRoutes');
const userRouter = require('./routes/usersRoutes');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log('Database connection successful'))
  .catch(({ message }) => {
    console.error('error:', message);
    process.exit(1);
  });

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/users', userRouter);
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status, message } = err;
  res.status(status || 500).json({ message });
  next();
});

module.exports = app;
