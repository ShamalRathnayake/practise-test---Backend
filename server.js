const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require('cors');
const products = require("./routes/api/Products");
const users = require('./routes/api/User');
const auth = require('./routes/api/auth');

const app = express();

//Bodyparser Middleware
app.use(express.json());

//allowing cross origin resource sharing
app.use(cors());

//Database Configuration
const db = config.get('mongoURI');

//mongoose deprecation warnings fix
const fix = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

//Connect to database
mongoose
  .connect(db, fix)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => console.log(err));

/*   
//Allowing cross origin resource sharing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
}); */

//Use Routes
app.use("/api/products", products);
app.use("/api/users", users);
app.use("/api/auth", auth);

//Define Port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
