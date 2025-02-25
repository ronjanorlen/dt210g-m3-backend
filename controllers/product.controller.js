const Product = require("../models/product.model"); // Inkludera produktmodel 

// Hämta alla produkter 
exports.getProducts = async (request, h) => {

    // sökfunktion
    const { search } = request.query; 
    let query = {}; // tomt objekt att börja med

    if (search) {
        query = { model: { $regex: search, $options: "i" } }; // Om search finns-filtrera
    }

    try {
        const products = await Product.find(query, {__v: 0});
        
        // Kontrollera om det finns produkter att hämta 
        if (products.length === 0) {
            return h.response({ message: "Hittade inga produkter." }).code(404);
        }
        // Returnera produkter om det finns några 
        return h.response(products).code(200);
        // Fånga upp fel 
    } catch (error) {
        console.error("Något gick fel vid hämtning av produkter.");
        return h.response(error).code(500);
    }
};

// Hämta produkt per ID 
exports.getProductById = async (request, h) => {
    try {
        const product = await Product.findById(request.params.id);
        // Kontrollera att produkten finns 
        if (!product) {
            return h.response({ message: "Produkten hittades inte." }).code(404);
        }
        // Returnera produkt om den finns 
        return h.response(product).code(200);
        // Fånga upp fel 
    } catch (error) {
        console.error("Något gick fel vid hämtning av produkten.");
        return h.response(error).code(500);
    }
};

// lägg till produkt 
exports.createProduct = async (request, h) => {
    try {
        // Lägg till ny produkt baserat på payload 
        const product = new Product(request.payload);
        const savedProduct = await product.save();
        // Returnera produkt om OK vid skapande 
        return h.response({
            message: "Produkten lades till.",
            product: savedProduct
        }).code(201);
        // Fånga upp fel 
    } catch (error) {
        // kontrollera om valideringsfel 
        if (error.title === "ValidationError") {
            // objekt för att lagra valideringsfel 
            const errors = {};
            // Loopa igenom fel och lägg i errors-objekt 
            Object.keys(error.errors).forEach((key) => {
                errors[key] = errors[key].message;
            });
            // Returnera felmeddelanden 
            return h.response(errors).code(400);
        }
        // Fånga upp fel 
        console.error("Något gick fel vid skapande av ny produkt: ", error);
        return h.response(error).code(500);
    }
};

// Uppdatera produkt baserat på ID 
exports.updateProduct = async (request, h) => {
    try {
        // Uppdatera produkt med data från payload 
        const updatedProduct = await Product.findByIdAndUpdate(
            request.params.id,
            request.payload, 
            { new: true, runValidator: true } // Säkerställ validering 
        );

        // kontroll att produkt hittades 
        if (!updatedProduct) {
            return h.response({ message: "Hittade inte produkten." }).code(404);
        }

        // Spara uppdatering 
        return h.response(updatedProduct).code(200);
        // Fånga upp fel 
    } catch (error) {
        console.error("Något gick fel vid uppdatering: ", error);
        return h.response(error).code(500);
    }
};

// Ta bort produkt baserat på ID 
exports.deleteProduct = async (request, h) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(request.params.id);
        // kontrollera att produkt hittas 
        if (!deletedProduct) {
            return h.response("Produkten hittades inte.").code(404);
        }

        // Lyckad borttagning 
        return h.response({ message: "Produkten togs bort." }).code(200);
        // Fånga upp fel 
    } catch (error) {
        console.error("Något gick fel vid borttagning av produkt: ", error);
        return h.response(error).code(500);
    }
};