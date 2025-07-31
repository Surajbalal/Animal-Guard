const express = require('express');
const app = express();

// app.use('./app',Routes);
app.use(express.json());
app.use(express.urlencoded({extended:true }))
app.get('/', function(req,res){
    res.send("hello")
})
app.listen()