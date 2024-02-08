const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    // Verificar si se proporcionaron nombre de usuario y contraseña
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    // Verificar si el nombre de usuario ya existe en la lista de usuarios
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }
    // Agregar el nuevo usuario al array de usuarios
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Convertir el objeto de libros a una cadena JSON para mostrarlo ordenadamente
    const booksList = JSON.stringify(books);
    return res.status(200).json({ books: booksList });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Obtener el ISBN de los parámetros de la solicitud
    const isbn = req.params.isbn;
    // Verificar si el libro con el ISBN proporcionado existe en la base de datos
    if (books[isbn]) {
        return res.status(200).json({ bookDetails: books[isbn] });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    // Crear un array para almacenar los libros del autor proporcionado
    let authorBooks = [];
    // Iterar a través de los libros y encontrar los que coincidan con el autor
    for (let isbn in books) {
        if (books[isbn].author === author) {
            authorBooks.push(books[isbn]);
        }
    }
    // Verificar si se encontraron libros del autor
    if (authorBooks.length > 0) {
        return res.status(200).json({ booksByAuthor: authorBooks });
    } else {
        return res.status(404).json({ message: "No books found by the author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    // Crear un array para almacenar los libros con el título proporcionado
    let titleBooks = [];
    // Iterar a través de los libros y encontrar los que coincidan con el título
    for (let isbn in books) {
        if (books[isbn].title === title) {
            titleBooks.push(books[isbn]);
        }
    }
    // Verificar si se encontraron libros con el título proporcionado
    if (titleBooks.length > 0) {
        return res.status(200).json({ booksByTitle: titleBooks });
    } else {
        return res.status(404).json({ message: "No books found with the title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // Verificar si el libro con el ISBN proporcionado existe en la base de datos
    if (books[isbn]) {
        // Obtener las reseñas del libro si existen
        const bookReviews = books[isbn].reviews;
        return res.status(200).json({ reviews: bookReviews });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});



module.exports.general = public_users;
