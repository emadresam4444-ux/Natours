process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});

const dotenv = require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE;
const PASSWORD = process.env.PASSWORD;
const DB = DATABASE_URL.replace('<db_password>', PASSWORD);


mongoose.connect(DB).then(() => {
  console.log('DB Connected ✅');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLE REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
