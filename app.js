// app.js
import express from 'express';
import productsRouter from './routers/products.js';
import cartsRouter from './routers/carts.js';

const PORT = 8080;
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
    res.send('¡Hola, todo OK!');
});

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});
