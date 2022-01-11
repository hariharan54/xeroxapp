const { authenticateUser, signJWT } = require("../services/authService");
const { validationResult } = require("express-validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");



exports.authenticateUser = async (credentials) => {
    try {
      const customer = await customers.findOne({ email_id: credentials.email_id});
      if (!customer) {
        throw "Invalid Credentials";
      }
      if (await argon2.verify(customer.password, credentials.password)) {
        delete customer.password;
        return customer;
      } else {
        throw "Invalid Credentials";
      }
    } catch (error) {
      throw error;
    }
  };

  exports.authenticateStore = async (credentials) => {
    try {
      const store_details = await store.findOne({ store_id: credentials.store_id });
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
  
  exports.signJWT = async (email) => {
    const payload = {
      user: {
        email,
      },
    };
  
    const jwtoken = jwt.sign(payload, process.env.COOKIE_SECRET, {
      expiresIn: 10000,
    });
    if (jwtoken) return jwtoken;
    throw "Error signing JWT";
  };


exports.CustomerLogin = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email_id, password } = req.body;
    try {
      const customer = await authenticateUser({ email_id, password });
      const token = await signJWT(customer.email_id);
      //console.log(token);
      const customerObj = utils.getCleanUser(customer);
      return res.json({ customer: customerObj, token });
    } catch (error) {
      return res.status(401).json({ errors: error });
    }
  };
  
  exports.CustomerRegister = async function (req, res) {
    //console.log(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      email_id,
      password,
      customer_name
    } = req.body;
    try {
      const createdCustomer = await CreateCustomer({
        email_id,
        password,
        customer_name
      });
      delete createdCustomer.password;
      return res.send(createdCustomer);
    } catch (error) {
      res.status(402).json({ errors: error });
    }
  };

  exports.StoreLogin = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { store_id, admin_password } = req.body;
    try {
      const store = await authenticateStore({ store_id, admin_password });
      const token = await signJWT(store.store_id);
      return res.json({ store: store, token });
    } catch (error) {
      return res.status(401).json({ errors: error });
    }
  };

  exports.StoreRegister = async function (req, res) {
    //console.log(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      store_id,
      upi_id,
      store_name,
      store_address,
      admin_password,
    } = req.body;
    try {
      const createdStore = await CreateStore({
        store_id,
      upi_id,
      store_name,
      store_address,
      admin_password
      });
      delete createdStore.password;
      return res.send(createdStore);
    } catch (error) {
      res.status(402).json({ errors: error });
    }
  };

  exports.CreateCustomer = async (userData) => {
    try {
      const hashedPassword = await argon2.hash(userData.password);
      userData.password = hashedPassword;
      const customer = new customers(userData);
      const createdCustomer = await customer.save();
      delete createdCustomer.password;
      return createdCustomer;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };

  exports.CreateStore = async (userData) => {
    try {
      const hashedPassword = await argon2.hash(userData.password);
      userData.password = hashedPassword;
      const store = new store(userData);
      const createdStore = await store.save();
      delete createdStore.password;
      return createdStore;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };