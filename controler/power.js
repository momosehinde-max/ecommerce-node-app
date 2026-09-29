
const pawer = require('../saver/pawer');

async function powera(req,res){

 
  let power = await pawer.create({
  mare: req.body.mare,
  id:req.user.id
});
   console.log(power);
};

async function seealder(req,res){

  let id = req.params.id;

  try {
  

let aloder = await pawer.find(
  {id: id}
);

if(aloder.length ===0){
return res.json({
    message:'no alder'
  })
};


res.json(aloder);

 } catch (error) {
    console.log(error);
  }


};

module.exports = {
  powera,
  seealder
};