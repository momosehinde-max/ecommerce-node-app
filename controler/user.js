

const path = require('path');

const mongoose = require('mongoose');

const marv = require('../saver/prodot.js')

//file for the admin ui
 function gofil(req,res) {
    res.sendFile(path.join(__dirname,'..','frontendfod','privat','ment.html'));
};

//file for the the costor mar ui
 function gocosa(req,res) {
    res.sendFile(path.join(__dirname,'..','frontendfod',
      'poblick','costom_ui.html'));
};

// a helper so every route answers with json, never an html error page
function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
};

async function add(req,res){

    if (!req.file || !req.body.name || req.body.price === undefined || req.body.price === '') {
      return res.status(400).json({
        masage:'A picture, a name and a price are all needed'
      });
    };

    let Image = `/uploads/${req.file.filename}`;
    let Name = req.body.name;
    let price = req.body.price;

  try {

   await marv.create({
    Image:Image,
    Name:Name,
    price:price
  });

    res.json({
      masage:"added sosesfule"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      masage:'Could not save the product'
    });

  }

};

 async function send(req,res){
  try {

    const prodoct = await marv.find();
    res.json(prodoct);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:'Could not load the products'
    });

  }
};

async function delet(req, res) {

    const id = req.params.id;

    // a bad id used to blow up with a database error
    if (!isValidId(id)) {
      return res.status(400).json({
        message: 'That product id is not valid'
      });
    }

    try {

        await marv.findByIdAndDelete(id);

        res.json({
            message: 'delete successful'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'delete failed'
        });

    }

};

async function edit(req, res) {

    const id = req.params.id;

    const Name = req.body.name;
    const price = req.body.price;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: 'That product id is not valid'
      });
    }

    try {

        const updateData = {
            Name: Name,
            price: price
        };


        if (req.file) {

            updateData.Image = `/uploads/${req.file.filename}`;

        }

        await marv.findByIdAndUpdate(
            id,
            updateData
        );

        res.json({
            message: 'update successful'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'update failed'
        });

    }

};

module.exports ={
  gofil,
  add,
  send,
  delet,
  edit,
  gocosa
};
