"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const database = require("./database/sequelize");
const cors = require("cors");
const routes = require("./routes/userRoutes");
const dotenv = require('dotenv');
const app = express();
const result = dotenv.config();
if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1); // Exit the application if there's an error
}
app.use(cors());
app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(routes);
const PORT = process.env.PORT; // set port, listen for requests
// database.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
database.sync().then(() => {
    console.log("connected to db");
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
});
