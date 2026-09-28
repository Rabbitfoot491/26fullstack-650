import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  // Track if we're editing (holds product id, or null if adding new)
  const [editId, setEditId] = useState(null);

  // Get Products
  const getProducts = async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Add or Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const product = {
      name: name,
      price: Number(price),
      category: category,
    };

    if (editId) {
      // Update existing product
      await fetch(`/api/products/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    } else {
      // Add new product
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    }

    // Reset form
    setName("");
    setPrice("");
    setCategory("");
    setEditId(null);

    getProducts();
  };

  // Load product into form for editing
  const startEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setEditId(product.id);
  };

  const cancelEdit = () => {
    setName("");
    setPrice("");
    setCategory("");
    setEditId(null);
  };

  // Delete Product
  const deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    getProducts();
  };

  return (
    <div>
      <h1>Product Management System</h1>

      {/* Add/Edit Product Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type="submit">
          {editId ? "Update Product" : "Add Product"}
        </button>

        {editId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      {/* Product Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.category}</td>
              <td>
                <button onClick={() => startEdit(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;