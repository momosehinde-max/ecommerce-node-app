const express =require("express");

const reqoer = express.Router();

const multer = require('multer');

const path = require('path');

const mave = require('../controler/user');

const upload = multer({dest:'uploads/'});



reqoer.get('/ment',mave.gofil); 

reqoer.get('/user',mave.gocosa); 

reqoer.post("/prodot",upload.single('image'),mave.add);

reqoer.get("/prodot",mave.send);

reqoer.delete('/prodot/:id',mave.delet);

reqoer.put('/prodot/:id',upload.single('image'),mave.edit);



module.exports = reqoer;