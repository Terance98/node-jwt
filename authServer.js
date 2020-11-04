const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
/*
To generate a secret key,
Open node repl in another terminal and type in the command
require('crypto').randomBytes(64).toString('hex');
*/

const app = express();
app.use(express.json());

let refreshTokens = [];

app.post("/login", (req, res) => {
  //Authenticate the user
  const { username } = req.body;
  const user = {
    name: username,
  };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
  //Every time a new refresh token is created, store it somewhere for future verificaiton.
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  console.log(refreshTokens);
  console.log(refreshToken);
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(401);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

//Delete the refresh token
app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.send("Token deleted");
})

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "25s" });
}

app.listen(4000);
