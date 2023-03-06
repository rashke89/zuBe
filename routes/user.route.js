const express = require("express");
const UserRouter = express.Router()
const ProductModel = require("../models/product.model")
const UserModel = require('../models/user.model')
const verifyToken = require("../validation/tokenValidation")
const stripe = require('stripe')
// secret key
const sk = 'sk_test_51LE86WICBi42q51Nzzn6JysljOWRoBSpAn2SpItLAANNUndhbBoOC5MtgS9PTeu63eE61NaYddhg2UGkXO4QZafc00ouJ8pP3w'
const stripeObj = stripe(sk)

UserRouter.get("/products/:userId", verifyToken, (req, res) => {
    const {userId} = req.params

    ProductModel.find({userId})
        .then((products) => {
            res.send(products)
        })
        .catch((err) => {
            res.status(415).send(err)
        })
})

UserRouter.get('/activate-account/:userId', (req, res) => {
    let {userId} = req.params
    try {
        UserModel.updateOne({_id: userId}, {isActive: true}, (error, data) => {
            if (error) {
                console.log(error)
                return res.status(410).send("Error while activating user.")
            }
            res.send("OK")
        })
    } catch (e) {
        res.status(410).send("Error while activating user.")
    }
})

UserRouter.get('/get-all/:elPerPage/:page', (req, res) => {
    console.log(req.params);
    const {elPerPage, page} = req.params
    UserModel
        .find({})
        .limit(elPerPage)
        .skip(elPerPage * page)
        .then(data => {
            UserModel
                .count()
                .exec((error, count) => {
                    if (error) {
                        return res.status(420).send('error on count')
                    }
                    return res.send({
                        elements: data,
                        pagination: {
                            totalItems: count,
                            page: Number(page),
                            elPerPage: Number(elPerPage)
                        }
                    })
                })
        })
        .catch(error => res.status(410).send(error))
})

UserRouter.get('/:id', verifyToken, (req, res) => {
    let {id} = req.params
    UserModel.find({
        _id: id,
    })
        .then((data) => {
            if (!data) {
                return res.status(209).send('no user');
            }
            res.send(data);
        })
        .catch((error) => {
            console.error(error);
            res.status(415).send(error);
        });
})

UserRouter.put('/activeStatus', (req, res) => {
    const body = req.body
    const query = { _id: body.id }
    console.log(req.body.id);
    UserModel.updateOne(query, {isActive:!req.body.isActive}, (error, data) => {
        if (error) {
            console.log(error)
            return res.status(435).send('Error on update user')
        }
        console.log(data);
        res.send('Successfully updated user.')
    })
})

UserRouter.delete('/deleteUser/:id', (req, res) => {
    const params = req.params.id
    UserModel.deleteOne({ _id: params }, async (error) => {
        if (error) throw error
        await res.send("User Deleted!")
    })
})

UserRouter.post('/search', (req, res) => {
    console.log(req.body);
    const value = req.body.searchValue
    UserModel.find({
        $or: [
            { username: { $regex: value, $options: 'i' } },
            { email: { $regex: value, $options: 'i' } },
            { firstName: { $regex: value, $options: 'i' } },
            { lastName: { $regex: value, $options: 'i' } },
        ]
    })
        .then((data) => {
            if (!data) {
                return res.status(209).send('no result for that value');
            }
            res.send(data);
        })
        .catch((error) => {
            console.error(error);
            res.status(415).send(error);
        });
});

UserRouter.post('/init-payment', verifyToken, async (req, res) => {
    console.log(req.body);
    try {
        const payment = await stripeObj.paymentIntents.create({
            amount: req.body.amount,
            currency: req.body.currency,
            automatic_payment_methods: {
                enabled: true
            }
        })


        res.send(payment)
    } catch (e) {
        res.status(431).send(e)
    }

})

module.exports = UserRouter