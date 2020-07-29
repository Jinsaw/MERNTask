const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() });
    }
    
    //Extraer email y password
    const { email, password } = req.body;

    try {
        //Validar email unico
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe'});
        }

        //Crea nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        //Salt genera un hash unico (si hay passsword iguales con el salt se generan diferentes)
        
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt );
        
        //Guardar Usuario
        await usuario.save();

        //Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;
            //Msj de confirmacion
            res.json({ token });
        });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}

//consiste en 2 partes: 1ero => crear el jwt con el payload de informacion que se almacena
                        //2do => firmarlo