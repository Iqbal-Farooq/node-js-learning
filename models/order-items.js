const Sequelize =require('sequelize')
 const sequelize =require('../util/database')
 const OredrItems = sequelize.define('oredrItems',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
 })
 module.exports = OredrItems;