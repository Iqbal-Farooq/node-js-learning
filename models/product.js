const mongoose=require('mongoose')
const Schema=mongoose.Schema
const productSchema= new Schema({
title:{
  type:String,
  reqired:true
} ,
price:{
  type:Number,
  reqired:true
},
description:{
  type:String,
  reqired:true
} ,
imageUrl:{
  type:String,
  reqired:true
} ,
userId:{
  type:Schema.Types.ObjectId,
  ref:'User',
  required:true
}

})
module.exports = mongoose.model('Product',productSchema);
