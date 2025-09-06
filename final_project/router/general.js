const express = require("express");
const bcrypt = require("bcrypt");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

async function hashPassword(plaintextPassword) {
  const saltRounds = 10; // Recommended value
  try {
    const hash = await bcrypt.hash(plaintextPassword, saltRounds);
    console.log('Original Password:', plaintextPassword);
    console.log('Hashed Password:', hash);
    // Store this 'hash' in your database.
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

public_users.post("/register", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password
  if(!username || !password){
    return res.status(400).json({message: "Please provide valid username and password"});
  }
  let checkUser = users.find((user)=>{
    return user.username === username;
  });
  if(checkUser){
    return res.status(200).json({message: "User already registered"});
  }
  users.push({username: username, password: await hashPassword(password)});
  console.log(JSON.stringify(users,null,2));
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {

  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let isbnBook = books[isbn];
  return res.status(200).json(isbnBook);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let result;
  for (const key in books) {
    if (books[key]["author"] === author) {
      result = books[key];
      return res.status(200).json(result);
    }
  }
  return res
    .status(200)
    .json({ message: `Book not found with author: ${author}` });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let result;
  for (const key in books) {
    if (books[key]["title"] === title) {
      result = books[key];
      return res.status(200).json(result);
    }
  }
  return res
    .status(200)
    .json({ message: `Book not found with title: ${title}` });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const review = books[req.params.isbn]["reviews"];
  return res.status(200).json(review);
});

module.exports.general = public_users;
