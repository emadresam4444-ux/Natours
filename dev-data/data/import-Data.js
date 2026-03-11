const fs = require('fs');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE;
const PASSWORD = process.env.PASSWORD;
const DB = DATABASE_URL.replace('<db_password>', PASSWORD);
const tourModel = require(`${__dirname}/../../models/tourModel.js`);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connected');
  })
  .catch(err => {
    console.log(err);
  });

const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const importData = async () => {
  try {
    await tourModel.create(tour);
    console.log('data Successfully imported ✅');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await tourModel.deleteMany();
    console.log('data Successfully deleted 🧨');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
console.log(process.argv);
if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}
