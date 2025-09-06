const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = 'fingerprint_customer';

let users = [];

async function checkPassword(plaintextPassword, hashedPasswordFromDB) {
  try {
    const isMatch = await bcrypt.compare(plaintextPassword, hashedPasswordFromDB);
    return isMatch; // Returns true or false
  } catch (error) {
    console.error('Error comparing passwords:', error);
  }
}

const isValid = (username)=>{ //returns boolean
  let user = users.find((user) => {
    return user.username === username;
  });
  return user? true: false;
}

const authenticatedUser = async(username,password)=>{ //returns boolean
  let existingUser = users.find((user)=>{
    return user.username === username;
  });
  let existingHashedPassword = existingUser.password;
  return await checkPassword(password, existingHashedPassword);
}

//only registered users can login
regd_users.post("/login", async(req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(!username|| !password){
    res.status(400).json({message:"Provide valid credentials to login"});
  }
  let isValidUser = isValid(username);
  if(!isValidUser){
    res.status(200).json({message:"user not found"});
  }
  let isUserAuthenticated = await authenticatedUser(username, password);
  if(!isUserAuthenticated){
    res.status(401).json({message:"Unauthorized user"});
  }
  const payload = { username: username };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  req.session.token = token;
  req.session.user = payload; // Optionally store user info too

  res.json({ message: 'Login successful!' });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
