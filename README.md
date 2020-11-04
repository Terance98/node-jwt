# node-jwt

JWTs are maily used for authentication purposes. We mainly use the signed token method of JWT. The other method is encryption.
JWTs are mainly used for authroization and information exchange.

In a JWT there are three components :
Header, Payload and Signature
xxxxx.yyyyy.zzzzz

Do note that for signed tokens this information, though protected against tampering, is readable by anyone. Do not put secret information in the payload or header elements of a JWT unless it is encrypted.

Therefore it is better exclude passwords or other critical data inside the JWT token.

To generate a secret key,
Open node repl in another terminal and type in the command: 
require('crypto').randomBytes(64).toString('hex');

The signature has to be securely stored in the server, preferably as an evironment variable.

Usaully we design one server for authentication. This will include access_token and refresh_token generation as well as the deletion of refresh_tokens

Access tokens and refresh tokens use different secret keys for signing the JWT token. Basically they both sign over the same JSON item.

Once a refresh token is generated, it is stored permanently in a database. Everytime we need to generate a new access token, we pass in the refresh token, verify if it exists in the db, if so we generate a new access token and sends it back to the user.

Access tokes are always bouded by an expiration time, otherwise it could lead to the misues of access tokens. Where as, refresh tokens never expire, they are permanently sotred in the db and are only used for matching for existence and the regenerating the new acess tokens which are again bounded by expiration time. 

If we want to delete the refresh token, we need to remove it from our database. This will prevent the creation of further new access tokens and will hence unauthroize the user permanently. This could also be called as a logout feature.

Now one server is exclusively for authentication and our next server will be for our main application itself. Our main server will share the access token's secret key and will use the same for verifying the incoming JWT tokens. This verification is done at a middleware function. The middleware function will verify the user and attach necessary information related to the user into the req property of the event. In addition to that it can also do authentication in the sense that if a user is not found, then we can pass in a unauthroized response back to the user. Now this middleware can be used along with all the endpoints of our main application to restrict the exposure of our endpoints.
