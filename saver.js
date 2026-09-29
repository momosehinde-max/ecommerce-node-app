
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


 
app.listen(PORT,()=>{
  console.log(`roun on pot ${PORT}`);
  })