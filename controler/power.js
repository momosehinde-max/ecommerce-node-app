
const pawer = require('../saver/pawer');

async function powera(req, res) {

  const mare = req.body.mare;

  // an empty order is not an order — do not store one
  if (!Array.isArray(mare) || mare.length === 0) {
    return res.status(400).json({
      message: 'Your cart is empty'
    });
  }

  try {

    let power = await pawer.create({
      mare: mare,
      id: req.user.id
    });

    console.log(power);

    // the page needs an answer, otherwise its fetch never finishes
    res.status(201).json({
      message: 'order placed',
      order: power
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'order failed',
      error: error.message
    });

  }

};

async function seealder(req, res) {

  let id = req.params.id;

  try {


    let aloder = await pawer.find(
      { id: id }
    );

    if (aloder.length === 0) {
      return res.json({
        message: 'no alder'
      })
    };


    res.json(aloder);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'could not load orders'
    });
  }


};

module.exports = {
  powera,
  seealder
};
