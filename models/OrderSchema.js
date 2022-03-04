const mongoose = require('mongoose')
const SingleCartItemSchema = mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    amount: {type: Number, required: true},
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    }
})
const OrderSchema = new mongoose.Schema({
    tax: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true, 
    },
    cartItems: {
        type: [SingleCartItemSchema],
      
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'delivered', 'paid', 'canceled'],
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String
    },


},  { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema);