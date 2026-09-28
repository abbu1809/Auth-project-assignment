import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 500,
  },
  images: {
    type: [
      {
        type: String,
      },
    ],
    validate: (images) => images.length <= 5,
    message: 'You can upload a maximum of 5 images',
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ['USD', 'INR'],
      default: 'INR',
    },
  },
  sizes: [
    {
      size: {
        type: String,
        enum: ['XS','S', 'M', 'L', 'XL', 'XXL'],
        required: true,
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
    },
  ],
  seller: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  }
});

const productModel = mongoose.model('Product', productSchema);
export default productModel;
