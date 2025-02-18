const mongoose = require("mongoose"); // Inkludera mongoose 

// Schema för produkter (skidor)
const productSchema = new mongoose.Schema({
    // Tillverkare 
    factory: {
        type: String,
        required: [true, "Ange tillverkare"]
    },
    // Modell 
    model: {
        type: String,
        required: [true, "Ange skidmodell"]
    },
    // Längd 
    skilength: {
        type: Number,
        required: [true, "Ange skidans längd"],
        min: [1, "Lägsta längd är 1"]
    },
    // Pris 
    price: {
        type: Number,
        required: [true, "Ange pris"],
        min: [0, "Lägst pris är 0"]
    },
    // Antal i lager
    quantity: {
        type: Number,
        required: [true, "Ange hur många som finns i lager"],
        min: [0, "Lägsta antal i lager är 0"]
    },

});

const Product = mongoose.model("Product", productSchema); // Skapa model för produkter 
module.exports = Product; // Exportera model 
