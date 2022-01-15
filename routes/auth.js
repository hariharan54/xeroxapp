const express = require('express')
const router = express.Router();
const login_register = require('../controllers/login_register')
const user_dash=require("../controllers/user_dash")

// This is for authentication with the database and rendering the dash board after authenticating
router.post("/user_dash_login", login_register.CustomerLogin)

router.post("/user_dash_register",login_register.CustomerRegister)

router.post("/store_dash_login",login_register.StoreLogin)

router.post("/store_dash_register",login_register.StoreRegister)

router.get("/neworder",(req,res)=>{
    res.render('user/neworder')
})

router.post("/createneworder",user_dash.newOrder)

module.exports = router