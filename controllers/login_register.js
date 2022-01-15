// const { validationResult } = require("express-validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const customers = require("../model/customers");
const printouts = require("../model/printouts");
const store = require("../model/store")
require("dotenv").config({path:'../.env'});

  
  const signJWT = async (email_id) => {
    const payload = {
      email_id: {
        email_id,
      },
    };
  
    const jwtoken = jwt.sign(payload, process.env.COOKIE_SECRET, {
      expiresIn: 100000000,
    });
    if (jwtoken) return jwtoken;
    throw "Error signing JWT";
  };


exports.CustomerLogin = async function (req, res) {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { email_id, password } = req.body;
    try {
      const customer = await authenticateUser({ email_id, password });
      const token = await signJWT(customer.email_id);
      //console.log(token);
      const customerObj = await getCleanUser(customer);
      const customerid=customerObj.email_id;
      const customerorders=await printouts.findAll({where:{customer_user_id:customerid}});
      res.render('user/dashboard',{customerObj,customerorders});
      // return res.json({ customer: customerObj, token });
    } catch (error) {
      return res.status(401).json({ errors: error });
    }
  };

  const authenticateUser = async (credentials) => {
    try {
      const customer = await customers.findOne({ where:{email_id: credentials.email_id}});
      if (!customer) {
        throw "Invalid Credentials";
      }
      if (await argon2.verify(customer.password, credentials.password)) {
        delete customer.password;
        return customer;        
      } else {
        throw "Invalid Password";
      }
    } catch (error) {
      throw error;
    }
  };
  
  exports.CustomerRegister = async function (req, res) {
    //console.log(req);
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const {
      email_id,
      password,
      customer_name
    } = req.body;
    try {
      const customerObj = await CreateCustomer({
        email_id,
        password,
        customer_name
      });
       res.render('user/dashboard',{customerObj}); // this is used to render the user dashboard similarly for other renders as well
    } catch (error) {
      res.status(402).json({ errors: error });
    }
  };

  const CreateCustomer = async (userData) => {
    try {
      const hashedPassword = await argon2.hash(userData.password);
      userData.password = hashedPassword;
      // const customer = new customers(userData);
      // const createdCustomer = await customer.save();
      const createdCustomer = await customers.create({
        email_id:userData.email_id,
        password:userData.password,
        customer_name:userData.customer_name
      })
      delete createdCustomer.password;
      return createdCustomer;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };

  exports.StoreLogin = async function (req, res) {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { store_id, admin_password } = req.body;
    try {
      const storeObj = await authenticateStore({ store_id, admin_password });
      const token = await signJWT(storeObj.store_id);
      return res.json({ store: storeObj, token });
    } catch (error) {
      return res.status(401).json({ errors: error });
    }
  };

  const authenticateStore = async (credentials) => {
    try {
      const store_details = await store.findOne({ where:{store_id: credentials.store_id} });
      if (!store_details) {
        throw "Invalid Credentials";
      }
      if (await argon2.verify(store_details.admin_password, credentials.admin_password)) {
        delete store_details.admin_password;
        return store_details;
      } else {
        throw "Invalid Credentials";
      }
    } catch (error) {
      throw error;
    }
  };

  exports.StoreRegister = async function (req, res) {
    //console.log(req);
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const {
      store_name,
      store_address,
      upi_id,
      store_id,
      admin_password
    } = req.body;
    try {
      const createdStore = await CreateStore({
        store_id,
      upi_id,
      store_name,
      store_address,
      admin_password
      });
      return res.render('store/dashboard',createdStore);
    } catch (error) {
      res.status(402).json({ errors: error });
    }
  };

  const CreateStore = async (userData) => {
    try {
      const hashedPassword = await argon2.hash(userData.admin_password);
      userData.admin_password = hashedPassword;
      const stores = new store(userData);
      const createdStore = await stores.save();
      delete createdStore.admin_password;
      return createdStore;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };

  async function getCleanUser(user) {
    if (!user) return null;
  
    return {
      email_id: user.email_id,
        password: user.password,
        customer_name: user.customer_name
    };
  }
  
