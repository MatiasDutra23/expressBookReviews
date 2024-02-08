const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Código para verificar si el nombre de usuario es válido
};

const authenticatedUser = (username, password) => {
  // Código para verificar si el nombre de usuario y la contraseña coinciden con los registros
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Verificar si el usuario existe y las credenciales son válidas
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    // Si las credenciales son válidas, crear y guardar un JWT para la sesión
    const token = jwt.sign(
      { username: user.username, iat: Math.floor(Date.now() / 1000) },
      "secret_key"
    );
    req.session.user = username; // Guardar el nombre de usuario en la sesión
    return res.status(200).json({ message: "Login successful", token: token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Define el endpoint para agregar o modificar una reseña de un libro
regd_users.put("/auth/review/:isbn", function (req, res) {
  // Obtén el ISBN y la nueva reseña de los parámetros y el cuerpo de la solicitud
  const isbn = req.params.isbn;
  const { review } = req.body;

  // Verifica si la reseña se proporcionó en el cuerpo de la solicitud
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Verifica si el libro con el ISBN proporcionado existe en el objeto books
  if (books[isbn]) {
    // Verifica si ya hay una reseña para este libro
    if (!books[isbn].reviews) {
      books[isbn].reviews = {}; // Si no hay reseñas, inicializa el objeto de reseñas
    }

    // Modifica o agrega la reseña del libro en el objeto books
    books[isbn].reviews[new Date().getTime()] = review; // Utiliza la marca de tiempo actual como clave de la reseña
    return res.status(200).json({
      message: "Review updated successfully",
      bookDetails: books[isbn],
    });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Obtener el ISBN del libro desde los parámetros de la solicitud
  const isbn = req.params.isbn;
  // Obtener el nombre de usuario de la sesión
  const username = req.session.user;

  // Verificar si el libro con el ISBN proporcionado existe en el objeto books
  if (books[isbn]) {
    // Verificar si hay revisiones para este libro
    if (books[isbn].reviews) {
      // Filtrar las revisiones del libro basadas en el nombre de usuario de la sesión
      const filteredReviews = Object.keys(books[isbn].reviews).filter(
        (key) => books[isbn].reviews[key].username === username
      );

      // Verificar si se encontraron revisiones para el usuario actual
      if (filteredReviews.length > 0) {
        // Eliminar las revisiones encontradas del libro
        filteredReviews.forEach((key) => {
          delete books[isbn].reviews[key];
        });

        return res.status(200).json({
          message: "Reviews deleted successfully",
          bookDetails: books[isbn],
        });
      } else {
        return res.status(404).json({
          message: "No reviews found for the current user",
        });
      }
    } else {
      return res
        .status(404)
        .json({ message: "No reviews found for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
