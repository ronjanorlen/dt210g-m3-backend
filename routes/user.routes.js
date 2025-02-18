const userController = require('../controllers/user.controller'); // Importera controller för användare
const Joi = require('joi'); // Inkludera joi 

module.exports = (server) => {
    server.route({
        // Hämta alla användare
        method: "GET",
        path: "/users",
        handler: userController.getAllUsers,
        options: {
            auth: false,
        },
    });
    // Hämta användare per ID 
    server.route({
        method: "GET",
        path: "/users/{id}",
        handler: userController.getUserById, 
        options: {
            auth: false,
        },
    });
    // Skapa användare 
    server.route({
        method: "POST",
        path: "/users",
        handler: userController.createUser,
        options: {
            auth: false,
        },
    });
    // Ta bort användare per ID
    server.route({
        method: "DELETE",
        path: "/users/{id}",
        handler: userController.deleteUser, 
        options: {
            auth: false,
        },
    });
    // Logga in användare 
    server.route({
        method: 'POST',
        path: '/login',
        handler: userController.loginUser,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().min(1),
                    password: Joi.string().min(1)
                }),
                failAction: (request, h, error) => {
                    throw error;
                }
            }
        }
    });
    // Logga ut användare 
    server.route({
        method: "GET",
        path: "/logout",
        handler: userController.logoutUser
    });
};