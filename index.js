const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const path = require('path')
const app=express();
require("dotenv").config({path:'./.env'});

app.use(cors({}));
// app.use(express.json());
app.use(bodyParser.json());
app.use(
    express.urlencoded({
      extended: false,
    })
  );

  const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

  app.set('view engine', 'hbs') // to set the html template engine


//check the routes folder 
app.use('/',require('./routes/pages')); 

app.use('/auth',require('./routes/auth'))


app.listen(process.env.PORT || 5000,()=>{
    console.log("Server is listening to port 5000")
})

