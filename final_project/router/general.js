const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let books = JSON.stringify(books,null,2);
  return res.status(200).json(books);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  let isbnBook = books[isbn];
  return res.status(200).json(isbnBook);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let result;
    for (const key in books) {
        if (books[key]['author'] === author){
            result = books[key];
            return res.status(200).json(result);
        }

    }
    return res.status(200).json({message: `Book not found with author: ${author}`});

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
    let result;
    for (const key in books) {
        if (books[key]['title'] === title){
            result = books[key];
            return res.status(200).json(result);
        }
    }
    return res.status(200).json({message: `Book not found with title: ${title}`});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const review = books[req.params.isbn]['reviews'];
  return res.status(200).json(review);
});

module.exports.general = public_users;
