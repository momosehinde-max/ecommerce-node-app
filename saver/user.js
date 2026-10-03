
const mongo =require('mongoose');

let marv = new mongo.Schema({

  name:{
    type:String,
    required:true
  },
  passw:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique: true
  }

});

module.exports = mongo.model('acunt',marv);