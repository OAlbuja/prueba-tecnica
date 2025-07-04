const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuración conexión a MySQL
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root1',
  database: 'prueba_pasante'
});

// Conectar a la base de datos MySQL

db.connect(err => {
  if (err) {
    console.error('Error conectando a la BD:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL');
});

// Datos de prueba
const productosDemo = [
  { nombre: 'Mouse Gamer', descripcion: 'Mouse con luces RGB', precio: 25.50, stock: 15 },
  { nombre: 'Auriculares', descripcion: 'Inalámbricos con cancelación de ruido', precio: 70.00, stock: 8 },
  { nombre: 'Monitor 27"', descripcion: 'Resolución 2K', precio: 200.00, stock: 5 }
];

productosDemo.forEach(prod => {
  db.query(
    'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
    [prod.nombre, prod.descripcion, prod.precio, prod.stock],
    (err) => {
      if (err) {
        console.error('❌ Error insertando producto demo:', err);
      } else {
        console.log(`✅ Producto demo insertado: ${prod.nombre}`);
      }
    }
  );
});

// Listar productos activos
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos WHERE activo = 1', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener productos');
    } else {
      res.json(results);
    }
  });
});

// Obtener un producto específico
app.get('/productos/:id', (req, res) => {
  db.query('SELECT * FROM productos WHERE id = ? AND activo = 1', [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener producto');
    } else {
      res.json(result[0]);
    }
  });
});

// Crear producto
app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  db.query('INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
    [nombre, descripcion, precio, stock], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al crear producto');
      } else {
        res.json({ id: result.insertId, mensaje: 'Producto creado con éxito' });
      }
    });
});

// Actualizar producto
app.put('/productos/:id', (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  db.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?',
    [nombre, descripcion, precio, stock, req.params.id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al actualizar producto');
      } else {
        res.json({ mensaje: 'Producto actualizado' });
      }
    });
});

// Soft delete
app.delete('/productos/:id', (req, res) => {
  db.query('UPDATE productos SET activo = 0 WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al eliminar producto');
    } else {
      res.json({ mensaje: 'Producto eliminado (soft delete)' });
    }
  });
});

app.listen(port, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${port}`);
});
