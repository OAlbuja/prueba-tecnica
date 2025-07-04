CREATE DATABASE prueba_pasante;

USE prueba_pasante;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    stock INT,
    activo BOOLEAN DEFAULT 1
);
