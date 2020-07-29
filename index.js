const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Crear servidor
const app = express();

//Conectar a la base de datos
conectarDB();

//Habilitar cors
app.use(cors());

//Habilitar express.js
app.use(express.json({ extended: true})); //Enviar como header/json

//Se utiliza el puerto 4000 para que no choque con el 3000 del cliente 
//Heroku busca la variable PORT por defecto
//Puerto de la app
const port = process.env.port || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


//Iniciar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})