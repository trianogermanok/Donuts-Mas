// routers/products.js
import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./data/products.json');

// Inicializar el ProductManager
await productManager.init();

// GET /api/products?limit=10
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (isNaN(pid)) {
            return res.status(400).json({ error: 'El ID del producto debe ser un número.' });
        }
        const product = await productManager.getProductById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (isNaN(pid)) {
            return res.status(400).json({ error: 'El ID del producto debe ser un número.' });
        }
        const updatedProduct = await productManager.updateProduct(pid, req.body);
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (isNaN(pid)) {
            return res.status(400).json({ error: 'El ID del producto debe ser un número.' });
        }
        await productManager.deleteProduct(pid);
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
