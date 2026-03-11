const dotenv = require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE;
const PASSWORD = process.env.PASSWORD;
const DB = DATABASE_URL.replace('<db_password>', PASSWORD);
mongoose
  .connect(DB)
  .then(() => { 
    console.log('DB connected');
  })
  .catch(err => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
