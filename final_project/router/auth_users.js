const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
    // Código para verificar si el nombre de usuario es válido
}

const authenticatedUser = (username, password) => { 
    // Código para verificar si el nombre de usuario y la contraseña coinciden con los registros
}

// Solo los usuarios registrados pueden iniciar sesión
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    // Verificar si el usuario existe y las credenciales son válidas
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        // Si las credenciales son válidas, crear y guardar un JWT para la sesión
        const token = jwt.sign({ username: user.username }, "secret_key");
        req.session.user = username; // Guardar el nombre de usuario en la sesión
        return res.status(200).json({ message: "Login successful", token: token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Agregar o modificar una reseña de un libro
regd_users.put('/auth/review/:isbn', function (req, res) {
    // Obtener el ISBN y la nueva reseña de los parámetros y el cuerpo de la solicitud
    const isbn = req.params.isbn;
    const { review } = req.body;

    // Verificar si la reseña se proporcionó en el cuerpo de la solicitud
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Verificar si el libro con el ISBN proporcionado existe en la base de datos
    if (books[isbn]) {
        // Verificar si ya hay una reseña para este libro
        if (!books[isbn].reviews) {
            books[isbn].reviews = {}; // Si no hay reseñas, inicializa el objeto de reseñas
        }

        // Modificar o agregar la reseña del libro
        books[isbn].reviews[new Date().getTime()] = review; // Utiliza la marca de tiempo actual como clave de la reseña
        return res.status(200).json({ message: "Review updated successfully", bookDetails: books[isbn] });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
