const User = require("../models/User.model"); // Inkludera user-model 
const Jwt = require("@hapi/jwt"); // Inkludera hapi jwt 
const bcrypt = require("bcrypt"); // Inkludera bcrypt 
require("dotenv").config(); // Inkludera dotenv 

// Hämta alla användare 
exports.getAllUsers = async (request, h) => {
    try {
        const users = await User.find();
        return h.response(users).code(200);
        // Fåna upp fel 
    } catch (error) {
        console.error("Något gick fel vid hämtning av användare: ", error);
        return h.response(error).code(500);
    }
};

// Hämt användare per ID 
exports.getUserById = async (request, h) => {
    try {
        const user = await User.findById(request.params.id);
        return h.response(user).code(200);
        // Fånga upp fel 
    } catch (error) {
        console.error("Kunde inte hämta användare: ", error);
        return h.response(error).code(500);
    }
};

// Skapa ny användare 
exports.createUser = async (request, h) => {
    try {
        // hämta uppgifter från payload 
        const { email, password } = request.payload;
        // kontrollera om email redan finns 
        const userExist = await User.findOne({ email });
        if (userExist) {
            return h.response({ error: "Denna e-postadress finns redan." }).code(400);
        }
        // Skapa objekt med ny användare 
        const user = new User({ email, password });
        console.log(user);
        // Spara ny användare 
        const savedUser = await user.save();
        return h.response({ message: "Användare skapad.", user: { email: savedUser.email } }).code(201);
        // Fånga upp fel 
    } catch (error) {
        return h.response({ message: error.message  }).code(500);
    }
};

// Ta bort användare 
exports.deleteUser = async (request, h) => {
    try {
        await User.findByIdAndDelete(request.params.id);
        return h.response({ message: "Användaren togs bort." }).code(200);
        //Fånga upp fel
    } catch (error) {
        console.error("Något gick fel vid borttatgning av användare: ". error);
        return h.response(error).code(500);
    }
};

// Logga in 
exports.loginUser = async (request, h) => {
    // Hämta e-post och lösen från payload 
    const { email, password } = request.payload;
    try {
        // Hämta användare från databasen 
        let user = await User.findOne({ email: email });
        // kontrollera att användare finns 
        if (!user) {
            return h.response({ message: "Felaktig e-postadress/lösenord." }).code(401);
        }
        // Kontrollera lösenord 
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return h.response({ message: "Felaktig e-postadress/lösenord." }).code(401);
        }
        // Hämta användare, exkludera lösenord 
        user = await User.findOne({ email: email }, { password: 0 });
        // generera token
        const token = generateToken(user);

        return h.response({ message: "Lyckad inloggning.", user: { email: user.email } }).state("jwt", token); // skapa HTTP-cookie 

        // Fånga upp fel 
    } catch (error) {
        console.error("Fel vid inloggning: ", error);
        return h.response({ message: error.message }).code(500);
    }
};

// Logga ut 
exports.logoutUser = async (request, h) => {
    try {
        // Ta bort cookie 
        h.unstate("jwt");
        return h.response({ message: "Utloggning lyckades." }).code(200);
        // Fånga upp fel 
    } catch (error) {
        return h.response({ error: "Misslyckad utloggning." }).code(500);
    }
};

// Generera JWT-token 
const generateToken = user => {
    const token = Jwt.token.generate(
        { user },
        { key: process.env.JWT_SECRET_KEY, algorithm: 'HS256' },
        { ttlSec: 24 * 60 * 60 * 1000 } // 24 timmar 
    );
    return token;
}