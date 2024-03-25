const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a user
public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

if (username && password) {
    const isUserRegistered = users.find((user) => user.username === username)
    if(!isUserRegistered) {
        users.push({"username": username, "password": password})
        res.status(201).json({message: "User successfully registred. Now you can login."});
    } else {
        res.status(404).json({message: "User already registered."});
    }
} else {
    res.status(404).json({message: "Cannot register the user."});
}
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const response = await axios.get('api_endpoint');
    return res.status(200).send(response.data.books);
  } catch (error) {
    return res.status(500).send('Error fetching book list');
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get('api_endpoint')
        return res.status(200).send(response.data.book)
    } catch (error) {
        return res.status(404).send({message: "Could not find the book"})
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

    try {
        const response = await axios.get('api_endpoint')
        return res.status(200).send(response.data.book)
    } catch (error) {
        return res.status(404).send({message: "Could not find the book"})
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const response = await axios.get('api_endpoint')
        return res.status(200).send(response.data.book)
    } catch (error) {
        return res.status(404).send({message: "Could not find the book"})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const bookByIsbn = Object.values(books).find((book)=> book["ISBN"] === isbn)
    if (!bookByIsbn) {
        return res.status(404).json({message: `Could not find the book with ISBN: ${isbn}`});
    }
    if (Object.values(bookByIsbn["reviews"]).length === 0) {
        return res.status(404).json({message: `The book with ISBN: ${isbn} has not received any reviews yet.`});
    }
  return res.status(200).json(bookByIsbn['reviews']);
});

module.exports.general = public_users;
