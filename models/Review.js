const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'please provide rating'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, 'please provide title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'please provide text'],
    },
    
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index(
  {
    product: 1,
    user: 1,
  },
  { unique: true }
);

ReviewSchema.statics.calculateAverageRating = async function(productId){
const result = await this.aggregate([
  {$match:{product:productId}},{
    $group:{
      _id:null, averageRating:{$avg:"$rating"},
      numOfReviews: {$sum:1}
    },
  },
])
try {
  await this.model('Product').findOneAndUpdate({_id:productId}, {
    averageRating: Math.ceil(result[0]?.averageRating || 0),
    numOfReviews: result[0]?.numOfReviews || 0
  })
}
catch(err) {
  console.log(err)
}
console.log(result)
console.log(productId)
}


ReviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.product)
  console.log('post save hook called')
})
ReviewSchema.post('remove', async function() {
  await this.constructor.calculateAverageRating(this.product)
  console.log('post remove hook called')
})
module.exports = mongoose.model('Review', ReviewSchema);
