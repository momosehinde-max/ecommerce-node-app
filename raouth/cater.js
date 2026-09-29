 
 
 const expre = require('express');
 
 const route = expre.Router();

 const ceous = require('../controler/crous');

 const pathe = require('../controler/power');

 route.post('/cat',ceous,pathe.powera);

 route.get('/prodot/:id',pathe.seealder);
 

 module.exports = route;


