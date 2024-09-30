const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Configuración de variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

app.use(cors());

// Middleware para procesar JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));  // Sirve archivos estáticos desde /public

// Rutas API
app.use('/api/auth', require('./routes/authRoutes'));

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
