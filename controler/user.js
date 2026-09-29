

const path = require('path');

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

async function add(req,res){

    let Image = `/uploads/${req.file.filename}`;
    let Name = req.body.name;
    let price = req.body.price;
  
   await marv.create({
    Image:Image,
    Name:Name,
    price:price
  });
  
    console.log(marv);
    res.json({
      masage:"added sosesfule"
    });
  
};

 async function send(req,res){
  const prodoct = await marv.find();
 res.json(prodoct);
};

async function delet(req, res) {

    const id = req.params.id;

    try {

        await marv.findByIdAndDelete(id);

        res.json({
            message: 'delete successful'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'delete failed',
            error: error.message
        });

    }

};

async function edit(req, res) {

    const id = req.params.id;

    const Name = req.body.name;
    const price = req.body.price;

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
            message: 'update failed',
            error: error.message
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

