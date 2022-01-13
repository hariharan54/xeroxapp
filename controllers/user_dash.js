const printouts = require("../model/printout")
const customers = require("../model/user")


exports.userOrders = async (req,res,userData) =>{
    try{
    const orders = await printouts.findAll({ where: {
        customer_user_id:userData.email_id
      }});
    if(!orders){
        res.status(402).json({ errors: "No order yet" });
    }
    return res.send(orders)
}catch(err){
    res.status(402).json({ errors: err });
}
}

exports.newOrder = async (req,res) =>{
    const orderData = req.body;
    if(!orderData){ res.status(402).json({ errors: "No order details entered" });}
    const printOrder = new customers(orderData);
    printOrder= await printOrder.save()
    return res.send(printOrder);
}
