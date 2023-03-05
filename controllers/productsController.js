const db = require('../src/database/models/index');
const { validationResult } = require('express-validator');
const mercadopago = require('mercadopago');

mercadopago.configure({ access_token: process.env.MERCADOPAGO_KEY });

const controller = {
   data: (req, res) => {
      db.Product.findAll().then(function (products) {
         return res.json(products);
      });
   },

   products: (req, res) => {
      db.Product.findAll().then(function (products) {
         return res.render('productCard', { products: products });
      });
   },

   create: function (req, res) {
      let oldData = req.body;
      return res.render('create', { oldData: oldData });
   },

   save: function (req, res) {
      const resultValidation = validationResult(req);
      if (resultValidation.errors.length > 0) {
         return res.render('create', {
            oldData: req.body,
            errors: resultValidation.mapped(),
         });
      }
      db.Product.create({
         name: req.body.name,
         description: req.body.description,
         image: req.file.filename,
         status: req.body.status,
         price: req.body.price,
         discount: req.body.discount,
      });
      res.redirect('/products');
   },

   detail: (req, res) => {
      db.Product.findByPk(req.params.id).then(function (product) {
         return res.render('productDetail', { product: product });
      });
   },

   edit: (req, res) => {
      db.Product.findByPk(req.params.id).then(function (product) {
         return res.render('edit', { product: product });
      });
   },

   update: (req, res) => {
      // incorporar olData y que los cambios en el edit no se pisen por el producto original, en caso de que las validaciones den error
      const resultValidation = validationResult(req);
      if (resultValidation.errors.length > 0) {
         db.Product.findByPk(req.params.id).then(function (product) {
            return res.render('edit', {
               product: product,
               errors: resultValidation.mapped(),
            });
         });
      } else {
         db.Product.update(
            {
               name: req.body.name,
               description: req.body.description,
               image: req.file.filename,
               status: req.body.status,
               price: req.body.price,
               discount: req.body.discount,
            },
            {
               where: {
                  id: req.params.id,
               },
            }
         );
         res.redirect('/products/productDetail/' + req.params.id);
      }
   },

   delete: (req, res) => {
      db.Product.destroy({
         where: {
            id: req.params.id,
         },
      });
      res.redirect('/products');
   },

   productCart: (req, res) => {
      db.Product.findByPk(req.params.id).then(function (product) {
         return res.render('productCart', { product: product });
      });
   },

   payments: (req, res) => {
      const carrito = req.body;
      const carritoNames = carrito.map((element) => {
         return element.amount + '-' + element.name;
      });
      const title = carritoNames.toString();
      const total = carrito.reduce((acc, prod) => acc + prod.amount * prod.price, 0);
      let preference = {
         items: [
            {
               id: 123,
               title: title,
               currency_id: 'ARS',
               picture_url: 'http://localhost:3000/images/products/ensalada-brie.png',
               category_id: 'art',
               quantity: 1,
               unit_price: total,
            },
         ],
         back_urls: {
            success: 'http://limaensaladas-production-ecc3.up.railway.app',
            failure: '',
            pending: '',
         },
         auto_return: 'approved',
         binary_mode: true,
      };
      mercadopago.preferences
         .create(preference)
         .then((response) => {
            res.status(200).send({ response });
         })
         .catch((error) => res.status(400).send({ error }));
   },
};

module.exports = controller;
