const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
    const registeredUser = users.filter((user)=> user.username === username && user.password === password)
    if (registeredUser.length > 0) {
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
 const username = req.body.username
 const password = req.body.password
 if (!username && !password) {
    res.status(404).send({message: "Could not log in."})
 }   
 if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60})

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send({message: "User logged in."})
 } else {
    return res.status(208).send({message: "Error logging in."})
 }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const loggedUser = req.session.authorization['username']
  const isbn = req.params.isbn
  const review = req.query.review
  const bookByIsbn = Object.values(books).find((book)=> book["ISBN"] === isbn)

  if (!bookByIsbn) {
      return res.status(404).json({message: `Could not find the book with ISBN: ${isbn}`});
  } else if (isValid(loggedUser)) {
    bookByIsbn['reviews'][loggedUser] = {"review": review }
    return res.status(201).json(bookByIsbn);
  } else {
    res.status(404).send({message: "User not logged in."})
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const loggedUser = req.session.authorization['username']
    const isbn = req.params.isbn
    const bookByIsbn = Object.values(books).find((book)=> book["ISBN"] === isbn)
  
    if (!bookByIsbn) {
        return res.status(404).json({message: `Could not find the book with ISBN: ${isbn}`});
    } else if (isValid(loggedUser)){
        delete bookByIsbn['reviews'][loggedUser] 
        return res.status(201).json(bookByIsbn);
    } else {
        res.status(404).send({message: "User not logged in."})
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
