const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get("/", async function (req, res) {
  try {
    // Simulating asynchronous behavior with a promise
    const booksList = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 100); // Adjust delay as needed
    });
    return res.status(200).json(booksList);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    // Simulating asynchronous behavior with a promise
    const bookDetails = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject("Book not found");
        }
      }, 100); // Adjust delay as needed
    });
    return res.status(200).json(bookDetails);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 12: Get book details based on author using async-await with Axios
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    // Simulating asynchronous behavior with a promise
    const authorBooks = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksByAuthor = Object.values(books).filter(
          (book) => book.author === author
        );
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject("No books found by the author");
        }
      }, 100); // Adjust delay as needed
    });
    return res.status(200).json(authorBooks);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 13: Get all books based on title using async-await with Axios
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    // Simulating asynchronous behavior with a promise
    const titleBooks = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksWithTitle = Object.values(books).filter(
          (book) => book.title === title
        );
        if (booksWithTitle.length > 0) {
          resolve(booksWithTitle);
        } else {
          reject("No books found with the title");
        }
      }, 100); // Adjust delay as needed
    });
    return res.status(200).json(titleBooks);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const bookReviews = books[isbn].reviews;
    return res.status(200).json({ reviews: bookReviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
