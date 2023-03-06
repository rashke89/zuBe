const express = require('express');
const productRoute = express.Router();
const ProductModel = require('../models/product.model');

const productValidation = require('../validation/productValidation')

productRoute.get("/test", (req, res) => {
    ProductModel.count({})
        .then((result) => {
            console.log(result)
        })

    res.send("ok")
})

productRoute.get('/get/:productId',
    productValidation.getProductValidator,
    (req, res) => {
        ProductModel.findOne({_id: req.params.productId})
            .then((products) => res.send(products))
            .catch((err) => res.status(415).send(err));
    })

productRoute.get('/get-all', (req, res) => {
    ProductModel.find({})
        .then((data) => res.send(data))
        .catch((error) => res.status(420).send('Error in DB.'));
});

productRoute.get('/get-all/:elPerPage/:page', (req, res) => {
    console.log(req.params);
    const {elPerPage, page} = req.params;

    ProductModel.find({})
        .limit(elPerPage)
        .skip(elPerPage * page)
        .then((data) => {
            ProductModel.count().exec((error, count) => {
                if (error) {
                    return res.status(420).send('Error on count.');
                }
                return res.send({
                    elements: data,
                    pagination: {
                        totalItems: count,
                        page: Number(page),
                        elPerPage: Number(elPerPage),
                    },
                });
            });
        })
        .catch((error) => res.status(420).send('Error in DB.'));
});

productRoute.get("/top-two", (req, res) => {
    let query = {
        title: {$in: [/LENOVO IdeaPad/, /GENESIS gejmerska stolica/]}
    };

    ProductModel.find(query)
        .then((products) => {
            res.send(products);
        })
        .catch((err) => {
            res.status(415).send(err);
        });
});

productRoute.post('/search', (req, res) => {
    ProductModel.find({
        // $regex = find any title with searchParam
        // $options = 'i' not case sensitive
        title: {$regex: req.body.searchParam, $options: 'i'},
    })
        .then((data) => {
            console.log(data);
            if (!data || !data.length) {
                return res.status(209).send('no results');
            }
            res.send(data);
        })
        .catch((error) => {
            console.error(error);
            res.status(415).send('error on search.');
        });
});

productRoute.post('/create', (req, res, next) => {
        let body = req.body;
        if (!body.title || !body.description || !body.price || !body.userId) {
            return res.status(431).send('Not valid form.')
        }
        next()
    },
    async (req, res) => {
        console.log(req.body);
        try {
            const newProduct = await ProductModel.create(req.body)
            newProduct.save()
            return res.send("OK")
        } catch (error) {
            res.status(432).send(error)
        }
    })

productRoute.get("/category/:id", (req, res) => {

})

productRoute.put('/update', (req, res) => {
    const body = req.body
    const query = {_id: body._id}
    ProductModel.updateOne(query, body, (error, data) => {
        if (error) {
            console.log(error)
            return res.status(434).send('Error on update product')
        }
        res.send('Successfully updated product.')
    })
})

module.exports = productRoute
