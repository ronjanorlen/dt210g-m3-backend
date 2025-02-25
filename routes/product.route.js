const ProductController = require("../controllers/product.controller"); // Inkludera controller för produkter 

module.exports = (server) => {
    server.route({
        // Hämta alla prdukter 
        method: "GET",
        path: "/products",
        handler: ProductController.getProducts,
        options: {
            auth: false,
        },
    });
    // Hämta produkt per ID 
    server.route({
        method: "GET",
        path: "/products/{id}",
        handler: ProductController.getProductById,
        options: {
            auth: false,
        },
    });
    // Lägg till produkt 
    server.route({
        method: "POST",
        path: "/products",
        handler: ProductController.createProduct,
        options: {
            auth: false,
        },
    });
    // Uppdatera produkt
    server.route({
        method: "PUT",
        path: "/products/{id}",
        handler: ProductController.updateProduct,
        options: {
            auth: false,
        },
    });
    // Ta bort produkt 
    server.route({
        method: "DELETE",
        path: "/products/{id}",
        handler: ProductController.deleteProduct,
        options: {
            auth: false,
        },
    });
}