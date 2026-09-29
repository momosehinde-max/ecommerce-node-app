const acoun = require('../saver/user');

const protect = require('bcrypt');

const jwt = require('jsonwebtoken');

async function redist(req,res){

  let {name,passw,email} = req.body;

  if(!name || !passw || !email ){
    return res.json({
      messages:'filling all the required',

    })
  };

  let cover = await protect.hash(passw,10);

  let creat = await acoun.create({

    name,

    passw:cover,

    email

  });

  let logine = jwt.sign(

    {id:creat._id},

    process.env.JWT_SECRET,

    {expiresIn:'1h'}

  );

  res.json({

    messages:'created successfully',

    logine

  });

};

async function loging(req,res){

  let {passw,email} = req.body;

  if(!passw || !email){

    return res.json({

      message:'Email or password not filled'

    });

  };

  let creat = await acoun.findOne({

    email

  });

  if(!creat){

    return res.status(401).json({

      message:'Email not found'

    });

  };

  let chekd = await protect.compare(

    passw,

    creat.passw

  );

if(!chekd){

    return res.status(401).json({

      message:'password not match'

    });

  };

  let logine = jwt.sign(

    {id:creat._id},

    process.env.JWT_SECRET,

    {expiresIn:'1h'}

  );


  res.json({

    messages:'login successfully',

    logine

  });

};

async function seeuser(req,res){

  let user = await acoun.find();

  res.json(user);

};


module.exports = {

  redist,

  loging,

  seeuser

};