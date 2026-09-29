
const mongo = require('mongoose');

  const marv = new mongo.Schema({
    Image:{
      type:String,
      require:true
    },
    Name:{
      type:String,
      require:true
    },
    price:{
      type:Number,
      require:true
    }
  });


module.exports = mongo.model('prodot',marv);