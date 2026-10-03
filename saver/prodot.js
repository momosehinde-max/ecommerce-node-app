
const mongo = require('mongoose');

  const marv = new mongo.Schema({
    Image:{
      type:String,
      // "require" was a typo here, so nothing was ever actually required
      required:true
    },
    Name:{
      type:String,
      required:true
    },
    price:{
      type:Number,
      required:true
    }
  });


module.exports = mongo.model('prodot',marv);