
const Sequelize=require('sequelize');
// const sequelize = new Sequelize('nodejs_learning','root','localhost',{
//     dialect:'mysql',host:'localhost'
// });
const sequelize = new Sequelize('nodejs_learning', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sequelize;

