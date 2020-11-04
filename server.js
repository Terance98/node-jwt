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

/*An inbuilt middleware of express which can identify incomeing data as JSON objects. 
express.urlencoded() is anotther inbuilt method of express used to recognize incoming request objects as Strings or Arrays
It is better to use body-parser instead of this, since it does both these things at once.
*/
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
  res.json(posts.filter((post) => post.username == req.user.name));
});

/*
Bearer TOKEN is just a naming convention used for sending tokens as headers.
Basically it's just a string. We then use slplit operation over it with whitesapce and use the second item since that's the token.
*/
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; //Because Token format => Bearer TOKEN

  if (!token) return res.sendStatus(401);

  //Here we can verify the token, identify the user from the DB and maybe attach the user details into the req field.
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

app.listen(3000);
