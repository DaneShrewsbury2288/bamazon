var mysql = require('mysql');
var inquirer = require("inquirer");

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Studly22!",
    database: "bamazonDB",
});

con.connect(function (err) {
    if (err) throw err;
});

initializeApp()

function initializeApp() {

    console.log("-------------------------------------------------------------");

    inquirer.prompt([{

        type: "list",
        name: "actionList",
        message: "Welcome Manager. What would you like to review?",
        choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]

    }]).then(function (user) {
        if (user.actionList === "View Products For Sale") {
            viewInventory();
        } else if (user.actionList === "View Low Inventory") {
            lowInventory();
        } else if (user.actionList === "Add To Inventory") {
            addInventory();
        } else if (user.actionList === "Add New Product") {
            addProduct();
        }
    });
}

function viewInventory() {

    con.query("SELECT * FROM products", function (err, res) {

        console.log("ID | Unique_ID | Product_Name | Price | Quantity");

        for (var i = 0; i < res.length; i++) {

            console.log(res[i].id + " | " + res[i].unique_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);

        }
        console.log("-------------------------------------------------------------");

        if (err) throw err;

        initializeApp();

    });
};

function lowInventory() {

    con.query("SELECT * FROM products WHERE stock_quantity<=5", function (err, res) {

        console.log("ID | Unique_ID | Product_Name | Price | Quantity");

        for (var i = 0; i < res.length; i++) {

            console.log(res[i].id + " | " + res[i].unique_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            console.log("-------------------------------------------------------------");

        };

        if (err) throw err;

        initializeApp();
    });
}

function addInventory() {

    inquirer
        .prompt([
            {
                type: "confirm",
                name: "confirmAdd",
                message: "Would you like to add inventory of a current product?",
                default: true
            }
        ])
        .then(function (answer) {

            if (answer.confirmAdd === false) {

                initializeApp();

            };

            if (answer.confirmAdd === true) {

                con.query("SELECT * FROM products", function (err, res) {

                    console.log("ID | Unique_ID | Product_Name | Price | Quantity");

                    for (var i = 0; i < res.length; i++) {

                        console.log(res[i].id + " | " + res[i].unique_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);

                    }

                    console.log("-------------------------------------------------------------");

                    if (err) throw err;

                });

                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "What is the ID Number of the product you would like to add?",
                            name: "product_id"
                        },
                        {
                            type: "input",
                            message: "How many units would you like to have in store?",
                            name: "quantity"
                        }
                    ])
                    .then(function (managerAdd) {

                        con.query("UPDATE products SET ? WHERE ?", [{

                            stock_quantity: managerAdd.quantity
                        }, {
                            unique_id: managerAdd.product_id
                        }],

                            function (err, res) {
                            });
                        console.log("You have successfully added inventory to the store!");
                        console.log("The stock of " + managerAdd.product_id + " has increased to " + managerAdd.quantity);
                        initializeApp();

                    })
            }
        });
}

function addProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter the product name:"
        },
        {
            name: "id",
            type: "input",
            message: "Enter the product id:"
        },
        {
            name: "department",
            type: "input",
            message: "Enter the product department:"
        },
        {
            name: "price",
            type: "input",
            message: "Enter the products price:",
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter the products quantity:"
        }
    ]).then(function (newItem) {
        con.query('INSERT INTO products SET ?', {
            unique_id: newItem.id,
            product_name: newItem.name,
            department_name: newItem.department,
            price: newItem.price,
            stock_quantity: newItem.quantity,
        }, function(err, res) {
            if (err) throw err;
            
            console.log("New item: " + newItem.name + " has been added to the store inventory!");
            initializeApp();
        });
    });
};

