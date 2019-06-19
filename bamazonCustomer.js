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

displayInventory();

function displayInventory() {
    con.query("SELECT * FROM products", function (err, res) {

        console.log("ID | Unique_ID | Product_Name | Price");
        for (var i = 0; i < res.length; i++) {

            console.log(res[i].id + " | " + res[i].unique_id + " | " + res[i].product_name + " | " + res[i].price);
        }
        console.log("-------------------------------------------------------------");
        if (err) throw err;

        intializeApp();
    });
};

function confirmPurchase(id, newQuantity, totalCost) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you would like to purchase this item and quantity?",
        default: true

    }]).then(function (userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            con.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: newQuantity,
                },
                {
                    unique_id: id,
                },
                {
                    product_sales: totalCost,
                },
            ],

                function (err, res) { });

            console.log("=================================");
            console.log("Transaction completed. Thank you.");
            console.log("=================================");
            displayInventory();
        } else {
            console.log("=================================");
            console.log("No worries. Maybe next time!");
            console.log("=================================");
            displayInventory();
        }
    });
}

function checkStock(id, quantity) {

    con.query("SELECT * FROM products WHERE unique_id= " + id, function (err, res) {
        if (err) throw err;

        if (quantity <= res[0].stock_quantity) {

            var totalCost = res[0].price * quantity;

            console.log("Good news your order is in stock!");
            console.log("Your total cost for " + quantity + " " + res[0].product_name + " is " + totalCost + " " + "dollars. Continue to checkout?");

            var newQuantity = (res[0].stock_quantity - quantity);

            confirmPurchase(id, newQuantity, totalCost);

        } else {
            console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + "" + "to complete your order.");
        };
    });

};

function intializeApp() {

    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID Number of the product you would like to purchase?",
                name: "product_id"
            },
            {
                type: "input",
                message: "How many units would you like to purchase?",
                name: "quantity"
            },
        ])
        .then(function (inquirerResponse) {

            var product_id = inquirerResponse.product_id;
            var quantity = inquirerResponse.quantity;

            checkStock(product_id, quantity);

        });
}

