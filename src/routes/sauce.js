// console.log("weow")

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

    router.get('/', auth, sauceCtrl.getAllSauces);
    router.post('/', auth, multer, sauceCtrl.createSauce);
    router.get('/:id', auth, sauceCtrl.getOneSauce); 
    router.delete('/:id', auth, sauceCtrl.deleteSauce);
    router.put('/:id', auth, multer, sauceCtrl.modifySauce);



    module.exports = router;
