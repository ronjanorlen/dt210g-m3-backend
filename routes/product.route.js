const ProductController = require("../controllers/product.controller"); // Inkludera controller för produkter 

module.exports = (server) => {
    server.route({
        // Hämta alla prdukter 
        method: "GET",
        path: "/products",
        handler: ProductController.getProducts
    });
    // Hämta produkt per ID 
    server.route({
        method: "GET",
        path: "/products/{id}",
        handler: ProductController.getProductById
    });
    // Lägg till produkt 
    server.route({
        method: "POST",
        path: "/products",
        handler: ProductController.createProduct
    });
    // Uppdatera produkt
    server.route({
        method: "PUT",
        path: "/products/{id}",
        handler: ProductController.updateProduct
    });
    // Ta bort produkt 
    server.route({
        method: "DELETE",
        path: "/products/{id}",
        handler: ProductController.deleteProduct
    });
}