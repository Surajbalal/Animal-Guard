const express = require('express');
// const { cookieParser } = require('cookie-parser');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 9000;
const routes = require('./Routes')

const app = express();

const cors = require('cors');
app.use(cors({
  origin: true,         // Reflects the request origin
  credentials: true     // Allows cookies/auth headers
}));

app.use(cookieParser())

app.use('/api',routes);

app.use(express.json());

app.use(express.urlencoded({extended:true }))

app.get('/', function(req,res){
    res.send("hello")
})
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
