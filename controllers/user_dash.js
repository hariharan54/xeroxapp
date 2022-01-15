const store = require("../model/store");
const printouts = require("../model/printouts")
const customers = require("../model/customers");
const payments = require("../model/payments");

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
    // res.send(orderData);
    if(!orderData){ res.status(402).json({ errors: "No order details entered" });}
    
    // const storeData = await store.findOne({where:{
        // store_name:orderData.store_name
    // }})
    const orderAmt=orderData.payment_amount;
    delete orderData.payment_amount;

    const email=orderData["customer_user_id"];
    // res.send(orderData);
    // orderData["store_id"]=storeData.store_id;
   
    let printOrder = new printouts(orderData);
    printOrder= await printOrder.save()
    let print_id=printOrder.print_id;

    let paymentdetails = new payments({
        "print_id":print_id,
        "payment_amount": orderAmt,
    })
    paymentdetails=await paymentdetails.save();

    // res.send(paymentdetails);
    const customerorders = await printouts.findAll({ where: { customer_user_id: email } });
    res.render('user/dashboard', {customerorders});

}
