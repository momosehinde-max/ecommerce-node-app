const jwt = require('jsonwebtoken')

async function ceous(req, res, next) {
  let auth = req.headers.authorization;
  if (!auth) {
    return res.json({
      message: 'rey loging'
    });
  };
  try {


    let marv = auth.split(' ')[1];

    // must be the same secret acunt.js signs with
    let mare = await jwt.verify(marv, process.env.JWT_SECRET);

    req.user = mare;

    next();

  } catch (erro) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  };
};
module.exports = ceous;
