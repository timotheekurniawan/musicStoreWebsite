a) Versions used on my platform:

1. Node.js = v14.17.3
2. JQuery = 2.1.3
3. Express.js = 4.17.1
4. MongoDB = using MongoDB atlas; username = 3322project ; password = 3322 ; database name = MusicStore


Other dependencies versions:
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "express-session": "^1.17.2",
    "jade-bootstrap": "^1.0.14",
    "mongoose": "^6.0.14",
    "nodemon": "^2.0.15",
    "pug": "^3.0.2"


b)

1. How to start MongoDB server = using MongoDB atlas; username = 3322project ; password = 3322 ; database name = MusicStore
   How to recreate database = node mdb-init.js

2. Start web server =
   1) npm install
   2) npm install -g nodemon
   3) node mdb-init.js (this .js file runs all the commands in MDBdata.txt; to initialize database)
   3) nodemon app.js
   4) browse "localhost:3000"

3. Access main page of web server = browse "localhost:3000", this is the main page


c) Work Completed

Part I

• Correctness of the login page (Fully implemented)
• Correctness of the create account page (Fully implemented)
• Correct functionality of verifying user’s login into the system (Fully implemented)
• Correct functionality of users’ account creation (Fully implemented)

• Correct functionality of the main page:
  Fully implemented, but web server does not have routes to categories other than Classical, Baroque, Romantic, and Late 19th
  (only have localhost:3000/classical, localhost:3000/baroque, localhost:3000/romantic, and localhost:3000/late19th)

• Correct functionality of the category page (Fully implemented)
• Correct functionality of the music information page (Fully implemented)
• Correct functionality of the cart page (Fully implemented)
• Correct functionality of the checkout page (Fully implemented)
• Correct functionality of the invoice page (Fully implemented)
• Correct functionality of logout (Fully implemented)
   
Part II

• Correct implementation of responsive web features in web pages (Fully implemented)
• CSS implementation in webpages (Fully implemented)
