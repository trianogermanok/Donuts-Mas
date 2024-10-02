// managers/ProductManager.js
import fs from 'fs';

class Product {
    constructor(title, description, image, price, stock, id = null) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.image = image;
        this.stock = stock;
        this.id = id;
    }
}

class ProductManager {
    constructor(file) {
        this.file = file;
        if (!fs.existsSync(this.file)) {
            fs.writeFileSync(this.file, JSON.stringify([]));
        }
    }

    async init() {
        try {
            await fs.promises.access(this.file);
            console.log('El archivo de productos existe.');
        } catch (err) {
            console.log('El archivo de productos no existe. Creándolo...');
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }
    }

    async readProductsFile() {
        try {
            const products = await fs.promises.readFile(this.file, 'utf-8');
            return JSON.parse(products);
        } catch (err) {
            console.error('Error leyendo el archivo de productos:', err);
            throw err;
        }
    }

    async writeProductsFile(data) {
        try {
            await fs.promises.writeFile(this.file, JSON.stringify(data, null, 2), 'utf-8');
        } catch (err) {
            console.error('Error escribiendo en el archivo de productos:', err);
            throw err;
        }
    }

    async createProduct(data) {
        const products = await this.readProductsFile();

        const { title, description, image, price, stock } = data;

        if (!title || !description || !price || !image || !stock) {
            throw new Error('Todos los campos son obligatorios para crear un producto.');
        }

        const exists = products.find(prod => prod.title === title);
        if (exists) {
            throw new Error('El producto ya existe.');
        }

        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const newProduct = new Product(title, description, image, price, stock, newId);

        products.push(newProduct);
        await this.writeProductsFile(products);
        return newProduct;
    }

    async getProducts(limit) {
        const products = await this.readProductsFile();
        if (limit && !isNaN(limit)) {
            return products.slice(0, limit);
        }
        return products;
    }

    async getProductById(id) {
        const products = await this.readProductsFile();
        return products.find(prod => prod.id === id);
    }

    async updateProduct(id, updatedData) {
        const products = await this.readProductsFile();
        const index = products.findIndex(prod => prod.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado.');
        }

        // Evitar actualizar el id
        const { id: _, ...data } = updatedData;

        products[index] = { ...products[index], ...data };
        await this.writeProductsFile(products);
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.readProductsFile();
        const filteredProducts = products.filter(prod => prod.id !== id);
        if (products.length === filteredProducts.length) {
            throw new Error('Producto no encontrado.');
        }
        await this.writeProductsFile(filteredProducts);
        return true;
    }
}

export default ProductManager;
