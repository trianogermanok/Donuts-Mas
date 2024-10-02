// routers/carts.js
import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const cartManager = new CartManager('./data/carts.json');
const productManager = new ProductManager('./data/products.json');

// Inicializar los managers
await cartManager.init();
await productManager.init();

// POST /api/carts
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        if (isNaN(cid)) {
            return res.status(400).json({ error: 'El ID del carrito debe ser un número.' });
        }
        const cart = await cartManager.getCartById(cid);
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);

        if (isNaN(cid) || isNaN(pid)) {
            return res.status(400).json({ error: 'El ID del carrito y del producto deben ser números.' });
        }

        // Verificar que el carrito existe
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        // Verificar que el producto existe
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
