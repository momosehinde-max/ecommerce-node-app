
require('dotenv').config();
const path = require('path');
const express = require('express');
const mango = require('./mangocon/db');
const multer = require('multer');
const routh = require('./raouth/product');
const routha = require('./raouth/infor');
const routhb = require('./raouth/cater');




const app = express();
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use(routh);
app.use(routha);
app.use(routhb);
 



const PORT = process.env.PORT || 3500;




mango();

app.use(express.static(
  path.join(__dirname,'frontendfod','poblick')
));


app.use( express.static(
  path.join(__dirname, 'frontendfod', 'privat')
));


/* Last line of defence: if any route throws, answer with json instead of an
   html page full of stack trace. Must stay after every route. */
app.use((err, req, res, next) => {

  console.log(err);

  if (res.headersSent) {
    return next(err);
  }

  const code = err.status || err.statusCode || 500;

  // multer complains with its own codes when an upload is rejected
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'That file is too large' });
  }

  res.status(code).json({
    message: code === 404 ? 'Not found' : 'Something went wrong'
  });

});

 
app.listen(PORT,()=>{
  console.log(`roun on pot ${PORT}`);
  })