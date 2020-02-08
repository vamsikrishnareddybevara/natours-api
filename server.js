const dotenv = require('dotenv');
const mongoose = require('mongoose');

// const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
); // connection string

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  })
  .then(() => {
    //con - connection object
    console.log('DB connection successful');
  });
