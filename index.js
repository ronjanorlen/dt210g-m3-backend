'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require("mongoose"); // Inkludera mongoose
require("dotenv").config(); // Inkludera dotenv 
const auth = require("./auth"); // Importera autentiserings-fil 

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 5000, // Port 5000 för backend 
        host: "0.0.0.0",
        routes: {
            cors: {
                origin: ["*"] // Tillåt alla cors-anrop
            }
        }
    });

     // Anslut till mongoDB
     mongoose.connect(process.env.DATABASE).then(() => {
        console.log("Ansluten till MongoDB");
    }).catch((error) => {
        console.error("Något gick fel vid anslutning till databasen: " + error); 
    });

    // Registera autentisering 
    await auth.register(server);

    // Registrera routes 
   require("./routes/product.route")(server);
   require("./routes/user.routes")(server);


    await server.start(); // Starta server 
    console.log('Server running on %s', server.info.uri);
};

// Hantera fel 
process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init(); // Kör igång servern