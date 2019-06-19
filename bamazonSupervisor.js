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

function initializeApp() {

    console.log("-------------------------------------------------------------");

    inquirer.prompt([{

        type: "list",
        name: "actionList",
        message: "Welcome Supervisor. What would you like to review?",
        choices: ["View Product Sales By Department", "Add New Department"]

    }]).then(function (user) {

        if (user.actionList === "View Product Sales By Department") {
            viewProductSales();
        } else if (user.actionList === "Add New Department") {
            addNewDepartment();
        };
    });
};