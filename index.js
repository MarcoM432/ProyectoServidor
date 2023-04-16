//Depencias y creacion de una instancia de express
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
// Creacion de los routers para los productos y carritos
const productsRouter = express.Router();
const cartsRouter = express.Router();
//Definicion de las funciones auxiliares para leer y escribir en los archivos JSON
function readJSONFile(filename) {
    const data = fs.readFileSync(filename);
    return JSON.parse(data);
  }
  
  function writeJSONFile(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  }
  
  function generateID(data) {
    return Math.max(...data.map((item) => item.id)) + 1;
  }
// Implementa las rutas para los productos
  // GET /api/products/
productsRouter.get('/', (req, res) => {
    const products = readJSONFile('productos.json');
    res.json(products);
  });
  
  // GET /api/products/:pid
  productsRouter.get('/:pid', (req, res) => {
    const products = readJSONFile('productos.json');
    const product = products.find((p) => p.id === parseInt(req.params.pid));
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  });
  
  // POST /api/products/
  productsRouter.post('/', (req, res) => {
    const products = readJSONFile('productos.json');
    const newProduct = {
      id: generateID(products),
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      status: req.body.status,
      stock: req.body.stock,
      category: req.body.category,
      thumbnails: req.body.thumbnails,
    };
    products.push(newProduct);
    writeJSONFile('productos.json', products);
    res.status(201).json(newProduct);
  });
  
  // PUT /api/products/:pid
  productsRouter.put('/:pid', (req, res) => {
    const products = readJSONFile('productos.json');
    const productIndex = products.findIndex((p) => p.id === parseInt(req.params.pid));
  
    if (productIndex !== -1) {
      const updatedProduct = { ...products[productIndex], ...req.body, id: products[productIndex].id };
      products[productIndex] = updatedProduct;
      writeJSONFile('productos.json', products);
      res.json(updatedProduct);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  });
  
  // DELETE /api/products/:pid
  productsRouter.delete('/:pid', (req, res) => {
    const products = readJSONFile('productos.json');
    const productIndex = products.findIndex((p) => p.id === parseInt(req.params.pid));
  
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      writeJSONFile('productos.json', products);
      res.status(204).send('Producto eliminado');
    } else {
      res.status(404).send('Producto no encontrado');
    }
  });
  
  app.use('/api/products', productsRouter);
  
