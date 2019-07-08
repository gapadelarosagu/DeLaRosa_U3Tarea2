const bodyParser = require('body-parser');//recupera lo que viene de body params
const express = require('express');
const morgan = require('morgan');//sirve para visualizar las peticiones que hace el cleinte al servidor
const wagner = require('wagner-core'); //inyector de dependencias, pone todos los modelos disponibles
const path = require('path');

const _config = require('./_config');
const expressJWT = require('express-jwt');


let app = express(); //se instancia el servidor

require('./models/models')(wagner);


app.use(morgan('dev')); //configuracion del servidor, para que cada peticion la tome morgan
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*'); //desde donde `pueden consultar la api *= todos lados
    res.setHeader('Access-Control-Allow.Methods','GET,POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type,Acept,Authorization');
    next();
});

const urlBase ="/api/v1/"; 

const jwtOptions = {
    path: [/^\/api\/v1\/usuarios\/login\/.*/]
};

app.use(expressJWT({secret:_config.SECRETJWT}).unless(jwtOptions));/*se protegen las rutas con una palabra secreta, en el unless se dice cuales no estan protegidas*/

app.use(function(err,req,res,next){
    if(err.name =="UnathorizedError"){
        res.status(err.status).send({
            code:err.status,
            message:err.message,
            details:err.code
        });
    }else{
        next();
    }
}); //para controlar el error cuando una ruta no esta autorizada

const user = require('./routers/user.router')(wagner); //ruta de los usuarios
const brand = require('./routers/brand.router')(wagner); //ruta de los brand

app.use(urlBase+"usuarios",user); //
app.use(urlBase+"brands",brand); //

module.exports = app;