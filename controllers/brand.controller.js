const http = require('http');
const path = require('path');
const status = require('http-status');

let _brand;//modelo

const createBrand = (req,res)=>{
    const brand = req.body;

    _brand.create(brand)
        .then((data)=>{
            res.status(200);
            res.json({msg:"Brand creada correctamente", data: data});
        })
        .catch((err)=>{
            res.status(400);
            res.json({msg:"Error! no se pudo crear", data:err});
        })
}

const findAll = (req,res)=>{
    _brand.find()
        .then((data)=>{
            if(data.length ==0){
                res.status(status.NO_CONTENT);
                res.json({msg:"No se encontraron brands"});
            }else{
                res.status(status.OK);
                res.json({msg:"Exito!",data:data});
            }
        })
        .catch((err)=>{
            res.status(status.BAD_REQUEST);
            res.json({msg:"Error"});
        });
}

const findOne = (req,res)=>{
    const {id} = req.params;
    const params={
        _id:id
    };

    _brand.find(params)
        .then((data)=>{
            if(data.length ==0){
                res.status(status.NO_CONTENT);
                res.json({msg:"No se encontro la brand"});
            }else{
                res.status(status.OK);
                res.json({msg:"Exito!",data:data});
            }
        })
        .catch((err)=>{
            res.status(status.BAD_REQUEST);
            res.json({msg:"Error"});
        });
}

const deleteByID = (req,res)=>{
    const {id} = req.params; //const id = req.params.id; es igual a esto
    const params={
        _id:id
    };

    _brand.findOneAndRemove(params)
        .then((data)=>{
                res.status(status.OK);
                res.json({msg:"Exito!",data:data});
        })
        .catch((err)=>{
            res.status(status.NOT_FOUND);
            res.json({msg:"Error! no se encontro"});
        });
}
const updateByID = (req,res)=>{
    const {id} = req.params;
    const brand = req.body;

    const params={
        _id:id
    };
    _brand.findOneAndUpdate(params,brand)
    .then((data)=>{        
        res.status(status.OK);
        res.json({msg:"Exito!",data:data});
    
    })
    .catch((err)=>{
        res.status(status.NOT_FOUND);
        res.json({msg:"Error! no se pudo actualizar"});
    });
}



module.exports = (Brand) =>{
    _brand = Brand; //se le asigna el valor del modelo
    return({
        createBrand, // es como hacer el module.export.createUser = createUser
        findAll,
        findOne,
        deleteByID,
        updateByID
        
    });
}