const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");


app.use(cors({ origin: "http://127.0.0.1:5500" }))
app.use(express.static('public'));
app.use(express.json());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
// const router=express.Router();
const router = require("./routes/files")

const PORT = process.env.PORT || 3000;

const connectDB = require('./config/db')
connectDB();

// app.use("/",router);
app.use('/', router);
app.use('/files', require('./routes/show'));



app.use('/', require('./routes/download'));

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})