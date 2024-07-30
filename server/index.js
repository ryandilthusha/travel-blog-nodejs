// Import required modules and middleware
const express = require("express"); // Import the Express framework to simplify server creation
const app = express();

const cors = require("cors"); // Import CORS to allow cross-origin requests
app.use(cors());

// Allow Express to automatically parse JSON payloads in incoming requests,
// Which means this allows to access request data via 'req.body'.
app.use(express.json());
app.use(express.urlencoded({extended: false}));



// Static files
app.use(express.static('public'));




// Routes setup
const loginRouter = require("./routes/loginRoutes.js"); // Import login route object
app.use("/login", loginRouter); // Use the Login Route

const registerRouter = require('./routes/registerRoutes.js'); // Import register route object
app.use('/register', registerRouter); // Use the register Route

const profileRouter = require("./routes/profileRoutes.js"); // Import profile route object
app.use("/profile", profileRouter); // Use the Profile Route

const indexRouter = require("./routes/indexRoutes.js"); // Import profile route object
app.use("/index", indexRouter); // Use the Profile Route

const postRouter = require("./routes/postRoutes.js"); // Import post route object
app.use("/post", postRouter); // Use the Post Route

const allpostsRouter = require("./routes/allpostsRoutes.js"); //Import post route object
app.use("/allposts", allpostsRouter); //Use the allpost Route

const reportusRouter = require('./routes/reportusRoutes.js');// Import contact_us route object
app.use('/reportus',reportusRouter); // use the contact_us route

const addNewPostRouter = require('./routes/addNewPostRoutes.js');// Import addNewPostRouter route object
app.use('/newPost',addNewPostRouter); // use the addNewPostRouter route

const userDetailsRouter = require('./routes/userDetailsRoutes.js');// Import userDetailsRouter route object
app.use('/userDetails',userDetailsRouter); // use the userDetailsRouter route



/* const {addNewPostRouter} = require('./routes/addNewPost.js'); // Import addNewPost route object
app.use('/new',addNewPostRouter); // use the addNewPost route  */

// Determine the port to listen on from environment variables or use 3001 as a default
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log server start message indicating successful launch and listening port
});
