const express = require('express');
const router = express.Router();
const path = require('path');
const control = require('../controler/acunt')



router.get('/singin',(req,res) =>{
  res.sendFile(path.join(__dirname,'..','frontendfod','poblick','cat.html'));

});

router.post('/acunt',control.redist);
router.post('/acunte',control.loging);
router.get('/acunte',control.seeuser);

module.exports = router;