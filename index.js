const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth.route')
const MONGO_DB_URL = require('./config/db.config')
const productRoute = require("./routes/product.route");
const singleProductRoute = require('./routes/singleProduct.route');
const portNumber = 5050
const mailRoute = require("./routes/mail.route")
const userRoute = require("./routes/user.route")
const categoryRoute = require("./routes/category.route");
const path = require("path");
const shopRoute = require("./routes/shop.route");

mongoose.set("strictQuery", false);
// connect to mongo DB

mongoose
  .connect(MONGO_DB_URL)
  .then((data) => {
    console.log("Mongo DB is connected.");
  })
  .catch((error) => {
    console.error(error);
    console.error("Error while connecting to mongo DB.");
  });
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname + "public")))

//routes
app.use('/api/auth', authRoute)
app.use('/api/product', productRoute)
app.use('/api/home', shopRoute)
app.use('/api/mail', mailRoute)
app.use('/api/user', userRoute)
app.use("/api/category", categoryRoute);
app.use('/api/productDetails', singleProductRoute);
app.get('/', (req, res) => {
	res.send("Server is working.")
})

app.listen(portNumber, (error) => {
	if (error) {
		console.log('---ERROR ON SERVER START---');
		console.log(error);
	} else {
		console.log(`Server is running on port: ${portNumber}`);
	}
});
