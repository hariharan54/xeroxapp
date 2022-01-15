const store = require("../model/store");
const printouts = require("../model/printouts")
const customers = require("../model/customers")


exports.userOrders = async (req,res,userData) =>{
    try{
    const orders = await printouts.findAll({ where: {
        customer_user_id:userData.email_id
      }});
    if(!orders){
        res.status(402).json({ errors: "No order yet" });
    }
    res.send(orders)
}catch(err){
    res.status(402).json({ errors: err });
}
}

exports.newOrder = async (req,res) =>{
    const orderData = req.body;
    res.send(orderData);
    // if(!orderData){ res.status(402).json({ errors: "No order details entered" });}
    // const storeData = await store.findOne({where:{
    //     store_name:orderData.store_name
    // }})
    // delete orderData.store_name
    // orderData["store_id"]=storeData.store_id;
    // const printOrder = new printouts(orderData);
    // printOrder= await printOrder.save()
    // res.send(printOrder);
}
