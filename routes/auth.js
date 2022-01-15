const express = require('express')
const router = express.Router();
const login_register = require('../controllers/login_register')
const user_dash=require("../controllers/user_dash")
const { QueryTypes } = require('sequelize');
const {sequelize}=require("../db/dbconnect")

// This is for authentication with the database and rendering the dash board after authenticating
router.post("/user_dash_login", login_register.CustomerLogin)

router.post("/user_dash_register",login_register.CustomerRegister)

router.post("/store_dash_login",login_register.StoreLogin)

router.post("/store_dash_register",login_register.StoreRegister)

router.get("/neworder",(req,res)=>{
    res.render('user/neworder')
})

router.get("/payment/:printid",async function(req,res){
    const print_id = req.params.printid;
        console.log(print_id)
        const orderdetails = await sequelize.query(
            'SELECT p.print_id,pay.payment_amount,s.upi_id,s.store_name,pay.payment_status FROM printouts p,payments pay,stores s WHERE p.print_id=? AND p.print_id=pay.print_id AND p.store_id=s.store_id',
            {
                replacements: [print_id],
                type: QueryTypes.SELECT,
            }
        );
        console.log(orderdetails)
    res.render("user/payments", {orderdetails})
    
    
})

router.post("/createneworder",user_dash.newOrder)

module.exports = router