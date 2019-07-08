const http = require('http');
const path = require('path');
const status = require('http-status');
const jwt = require('jsonwebtoken');
const _config = require('../_config');
const fs = require('fs');//
const csv = require('csv-parse');//

let _user;//modelo

const createUser = (req,res)=>{
    const user = req.body;

    _user.create(user)
        .then((data)=>{
            res.status(200);
            res.json({msg:"Usuario creado correctamente", data: data});
        })
        .catch((err)=>{
            res.status(400);
            res.json({msg:"Error!", data:err});
        });
}

const loginUser = (req,res)=>{
    const user = req.body.username;
    const pass = req.body.password;

    _user.findOne({email:user})
        .then((data)=>{
            if(data!=null&&data.password==pass){
                res.status(200);
                res.json({msg:"Login exitoso, Bienvenido!!!"});
            }else{
                res.status(401);
                res.json({msg:"Usuario y/o password incorrectos"});
            }
            
        })
        .catch((err)=>{
            res.status(400);
            res.json({msg:"Error!",data:err});
        });
}

const findAll = (req,res)=>{
    _user.find()
        .then((data)=>{
            if(data.length ==0){
                res.status(status.NO_CONTENT);
                res.json({msg:"No se encontraron usuarios"});
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

    _user.find(params)
        .then((data)=>{
            if(data.length ==0){
                res.status(status.NO_CONTENT);
                res.json({msg:"No se encontro el usuario"});
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

    _user.findOneAndRemove(params)
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
    const user = req.body;

    const params={
        _id:id
    };
    _user.findOneAndUpdate(params,user)
    .then((data)=>{        
        res.status(status.OK);
        res.json({msg:"Exito!",data:data});
    })
    .catch((err)=>{
        res.status(status.NOT_FOUND);
        res.json({msg:"Error! no se pudo actualizar"});
    });
}

const login =(req,res) =>{
    const{ email,password} = req.params;
    let query ={email:email,password:password};
    _user.findOne(query,"-password")
    .then((user)=>{
        if(user){
            const token = jwt.sign({email:email}, _config.SECRETJWT);
            res.status(status.OK);
            res.json({
                msg:"Acceso exitoso",
                data:{
                    user:user,
                    token:token
                }
            });
        }else{
            res.status(status.NOT_FOUND);
            res.json({msg:"Error! No se encontro"});
        }
    })
    .catch((err)=>{
        res.status(status.NOT_FOUND);
        res.json({msg:"Error! No se encontro",err,err});
    });
}

const readWriteCSV =(req,res)=>{
    fs.createReadStream("prueba.csv") // Abrir archivo
    .pipe(csv())
    .on('data',async(row)=>{
        let user={
            name:row[0],
            email:row[1],
            password:row[2]
        };
        await _user.create(user)        
        .catch((err)=>{
            res.status(400);
            res.json({msg:"Error!", data:err});
        });
        console.log(row);
    })
    .on('end',()=>{
        res.json({msg:"Se termino de leer"});
        console.log("Exitoso");
    });
}

   


/*
function leer(error,datos){
    if (error)
      console.log(error);
    else
      console.log(datos.toString());
  }
  
  fs.readFile('./prueba.csv',leer);

*/





module.exports = (User) =>{
    _user = User; //se le asigna el valor del modelo
    return({
        createUser, // es como hacer el module.export.createUser = createUser
        findAll,
        findOne,
        deleteByID,
        updateByID,
        loginUser,
        login,
        readWriteCSV
    });
}