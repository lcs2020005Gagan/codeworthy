const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
 title:{
    type:String,
    required:true
 },
 description:{
    type:String
 },
 tags:{
    type:Array,
    default:[""]
 },
 difficulty:{
    type:String
 },
 link:{
    type:String
 },
});
const questions = mongoose.model("questions", questionsSchema);
questions.createIndexes();
module.exports = questions;
