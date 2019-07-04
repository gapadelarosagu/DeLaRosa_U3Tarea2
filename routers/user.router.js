const router = require('express').Router();

module.exports = (wagner)=>{

    const userCtrl= wagner.invoke((User)=> require('../controllers/user.controller')(User));
    

    //USUARIOS
    router.post('/',(req,res)=>{
        userCtrl.createUser(req,res);
    });

    router.get('/',(req,res)=>{
        userCtrl.findAll(req,res);
    });

    router.get('/:id',(req,res)=>{
        userCtrl.findOne(req,res);
    });

    router.delete('/:id',(req,res)=>{
        userCtrl.deleteByID(req,res);
    });

    router.put('/:id',(req,res)=>{
        userCtrl.updateByID(req,res);
    });

    router.post('/login',(req,res)=>{
        userCtrl.loginUser(req,res);
    })
    


    return router;

}