// managers/CartManager.js
import fs from 'fs';

class CartManager {
    constructor(file) {
        this.file = file;
        if (!fs.existsSync(this.file)) {
            fs.writeFileSync(this.file, JSON.stringify([]));
        }
    }

    async init() {
        try {
            await fs.promises.access(this.file);
            console.log('El archivo de carritos existe.');
        } catch (err) {
            console.log('El archivo de carritos no existe. Creándolo...');
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }
    }

    async readCartsFile() {
        try {
            const carts = await fs.promises.readFile(this.file, 'utf-8');
            return JSON.parse(carts);
        } catch (err) {
            console.error('Error leyendo el archivo de carritos:', err);
            throw err;
        }
    }

    async writeCartsFile(data) {
        try {
            await fs.promises.writeFile(this.file, JSON.stringify(data, null, 2), 'utf-8');
        } catch (err) {
            console.error('Error escribiendo en el archivo de carritos:', err);
            throw err;
        }
    }

    async createCart() {
        const carts = await this.readCartsFile();
        const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
        const newCart = {
            id: newId,
            products: []
        };
        carts.push(newCart);
        await this.writeCartsFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.readCartsFile();
        return carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.readCartsFile();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado.');
        }

        const productInCart = carts[cartIndex].products.find(prod => prod.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            carts[cartIndex].products.push({ product: productId, quantity: 1 });
        }

        await this.writeCartsFile(carts);
        return carts[cartIndex];
    }
}

export default CartManager;
