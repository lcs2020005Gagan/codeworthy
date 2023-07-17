const mongoose=require("mongoose")
mongoose.set('debug', true);

const usersSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
profileImg:{
    type:String
},
notes:{
    type:Object,
    default:{}
},
solvedQuestions:[{type: mongoose.Schema.Types.ObjectId,
    ref: 'questions'}],
savedQuestions:[{type: mongoose.Schema.Types.ObjectId,
    ref: 'questions'}],

});
const users=mongoose.model("users",usersSchema);
users.createIndexes();
module.exports=users