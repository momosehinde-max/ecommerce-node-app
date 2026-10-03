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

  try {

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

  } catch (error) {

    // the email column is unique, so signing up twice lands here
    if (error && error.code === 11000) {
      return res.status(409).json({
        messages:'That email already has an account',
      });
    }

    console.log(error);

    res.status(500).json({
      messages:'Could not create the account, please try again',
    });

  }

};

async function loging(req,res){

  let {passw,email} = req.body;

  if(!passw || !email){
    return res.json({

      message:'Email or password not filled'

    });
  };

  try {

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

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:'Could not sign you in, please try again'
    });

  }

};

async function seeuser(req,res){

  try {

    // never send the password hashes to the browser
    let user = await acoun.find().select('-passw');

    res.json(user);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:'Could not load customers'
    });

  }

};


module.exports = {

  redist,

  loging,

  seeuser

};
