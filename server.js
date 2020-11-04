const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/*
To generate a secret key,
Open node repl in another terminal and type in the command
require('crypto').randomBytes(64).toString('hex');
*/

const app = express();
app.use(express.json());

const posts = [
  {
    username: "kyle",
    title: "post 1",
  },
  {
    username: "jim",
    title: "post 2",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username == req.user.name));
});


function authenticateToken(req,res,next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];   //Because Token format => Bearer TOKEN

    if(!token) return res.sendStatus(401);

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(401);
        req.user = user;
        console.log(user);
        next();
    })
}

app.listen(3000);
