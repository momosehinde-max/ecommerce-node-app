const mangos = require('mongoose');

async function conet() {
  try{  
  await mangos.connect(process.env.MONGO_URI);

  console.log('conected');


}catch(err){
  console.log(err);
}
};

module.exports = conet;