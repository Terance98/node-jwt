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

//A function to sign a JSON object with ACCESS_TOKEN_SECRET that expires in 25 seconds.
function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "25s" });
}

let refreshTokens = [];

/*
Generate access token & refresh token
Ususally you can add another layer of req.body wich user credentials and do authentication here.
However, even after authentication, you only need to pass in the username and not the password.
*/
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

//Regenerate access tokens
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401); //Cheking if refreshToken is undefined
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(401); //Checking if the refreshToken belongs to our set of valid refresh toekns in use.

  //We verify the refresh token, extract the user out of it and then re-sign it with the ACCESS_TOKEN_SECRET to generate a new access token and sends it back to the user. 
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

//Delete the refresh token
app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.send("Token deleted");
});

app.listen(4000);
