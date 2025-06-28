const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db.js');
const dotenv =  require('dotenv');
const app = express();
const PORT = 5000;
const session = require('express-session');
const passport = require("./config/passport.js");

dotenv.config();



// Middleware
app.use(cors({
  origin: ["https://stirring-pithivier-5bafe2.netlify.app"],
  credentials: true
}));

app.use(bodyParser.json());

// MongoDB Connection
connectDB();

//Admin All products
app.use("/api/products",require('./Routes/AdminAllProduct.js'));
//chair products
app.use("/api/products1", require("./Routes/FetchPublicProduct.js"));
//Golden Furniture
app.use("/api/products2", require("./Routes/FetchPublicProduct.js"));
// Railing
app.use("/api/products3", require("./Routes/FetchPublicProduct.js"));
//Tea Tabel
app.use("/api/products4", require("./Routes/FetchPublicProduct.js"));
// Dining Tabel
app.use("/api/products5", require("./Routes/FetchPublicProduct.js"));
// Bed
app.use("/api/products6", require("./Routes/FetchPublicProduct.js"));
// Glass Railing
app.use("/api/products7", require("./Routes/FetchPublicProduct.js"));
// Steel Gate
app.use("/api/products8", require("./Routes/FetchPublicProduct.js"));
// Steel window
app.use("/api/products9", require("./Routes/FetchPublicProduct.js"));
// Acrylic Design
app.use("/api/products10", require("./Routes/FetchPublicProduct.js"));
// Cnc Design
app.use("/api/products11", require("./Routes/FetchPublicProduct.js"));
// Cnc Frame
app.use("/api/products12", require("./Routes/FetchPublicProduct.js"));
//Panipuri Counter
app.use("/api/products13", require("./Routes/FetchPublicProduct.js"));
//Idli Dosa Counter
app.use("/api/products14", require("./Routes/FetchPublicProduct.js"));
//Steel Dj Vehicle
app.use("/api/products15", require("./Routes/FetchPublicProduct.js"));
//Lakshmi mata Decorative Paviloan
app.use("/api/products16", require("./Routes/FetchPublicProduct.js"));
//Sliding window
app.use("/api/products17", require("./Routes/FetchPublicProduct.js"));
//Chemical door
app.use("/api/products18", require("./Routes/FetchPublicProduct.js"));
//SS design maker
app.use("/api/products19", require("./Routes/FetchPublicProduct.js"));


// Ratings 
app.use("/api/product",  require("./Routes/Ratings.js"));
//productdetailsroutes
app.use("/api/product", require("./Routes/ProductDetailsroutes.js"));
// Home latest product 
app.use("/api/product", require("./Routes/HomeProduct.js"));
//ShopAllProduct
app.use("/api/products", require("./Routes/Shopallproducts.js"));
//create community
app.use("/api/community", require("./Routes/CommunityRoutes.js"));
// community User Routes
app.use("/api/user", require("./Routes/CommunityUser.js"));
//Cart routes
app.use("/api/cart", require("./Routes/Cartroute.js"));
//Product Routes
app.use("/api/products", require("./Routes/ProductRoutes.js"));
//Signup Routes
app.use('/', require('./Routes/Auth.js'));
//Admin Routes
app.use('/api', require('./Routes/Admin.js'));
app.use('/api/admin', require('./Routes/Admin.js'));
//total product count
app.use('/api/admin',require('./Routes/Admin.js'));
//Make Admin
app.use('/api/admin',  require("./Routes/RegisterAdmin.js"));
//profile image upload cloudinary
app.use('/api/upload', require("./Routes/ProfileImage.js"));
//profileimage Frontend display
app.use('/api/user', require("./Routes/Userprofile.js"));
//Forgot Password
app.use("/", require("./Routes/ForgotPassword.js"));


// Github Signup 
app.use(session({
  secret: process.env.GITHUB_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require("./Routes/githubAuth.js"));


// Start Server
app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
