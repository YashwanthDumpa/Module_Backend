export {}
const express = require("express");
const bodyParser = require("body-parser");
const database = require("./database/sequelize");
const cors = require("cors");

const routes = require("./routes/userRoutes");
const {initWebSocket} = require('./websocket');
const trainingrRoutes = require("./routes/trainingRoutes");
const dotenv = require("dotenv");
const http = require('http')
const app = express();
const PORT = process.env.PORT; // set port, listen for requests
const httpserver = http.createServer(app)


process.on("uncaughtException", err =>{
  console.log(`Error : ${err.message}`);
  console.log("sutting down the server due to Uncaught Exception");
  process.exit(1);
})

// Initialize WebSocket server
export const wss = initWebSocket(httpserver);

const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
}
// Exit the application if there's an error





app.use(cors());
app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(routes);
app.use(trainingrRoutes);

// database.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// checking connection to the database

database.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error:any) => {
    console.error('Unable to connect to the database:', error);
  })
  


  // synchronizing database


  database.sync({force:false}).then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error:any) => {
    console.error('Error synchronizing database:', error);
  });





httpserver.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

  // Unhandled Promise Rejection

// process.on("unhandledRejection", err =>{
//   console.log(err);
  
//   console.log("sutting down the server due to unhandled Promise Rejection");

//   httpserver.close(()=>{
//       process.exit(1);
//   })
// })



