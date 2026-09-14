const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

let products = require("./products.json");

// GET all products
app.get("/products", (req, res) => {
    res.json(products);
});

// GET product by ID
app.get("/products/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const product = products.find(product => product.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});

// POST - add a product
app.post("/products", (req, res) => {

    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

// PUT - update a product
app.put("/products/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const product = products.find(product => product.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;

    res.json({
        message: "Product updated successfully",
        product: product
    });
});

// DELETE - delete a product
app.delete("/products/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const deletedProduct = products.splice(index, 1);

    res.json({
        message: "Product deleted successfully",
        product: deletedProduct[0]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

