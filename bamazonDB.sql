DROP DATABASE IF EXISTS bamazondb;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
	id INT AUTO_INCREMENT, 
    unique_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales INT,
    PRIMARY KEY (id)
);

CREATE TABLE departments (
department_id INT NOT NULL,
department_name VARCHAR(100) NOT NULL,
over_head_costs INT NOT NULL
);

SELECT * FROM products;
SELECT * FROM departments;

SELECT * FROM products WHERE unique_id= 105234;

UPDATE products SET stock_quantity = 10000 WHERE unique_id=104252;




