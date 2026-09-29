


const mango = require('mongoose');

const cat = new mango.Schema({
  mare:{
    type: Array,
    required: true
  },

  id:{
    type: String,
    required: true
  }
});

 module.exports = mango.model('confams',cat);
 