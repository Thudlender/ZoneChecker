require("dotenv").config({ path: "../.env" });
console.log(process.env.HOST,process.env.PASSWORD,process.env.USER,process.env.DATABASE,process.env.dialect)
module.exports = {
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DATABASE,
  dialect: process.env.dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};