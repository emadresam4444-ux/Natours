const mongoose = require('mongoose');
var slugify = require('slugify');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'name is required'],
    unique: true,
    minLength: [10, 'A tour name must have more than 10 characters'],
    maxLength: [40, 'A tour name must have less than 40 characters'],
    validate: {
      validator: function(val) {
        return /^[a-zA-z\s]+$/.test(val);
      },
      message: 'Name must be String only'
    }
  },
  slugName: String,
  duration: {
    type: Number,
    required: [true, 'duration is required']
  },
  secretTour: {
    type: Boolean,
    default: false
  },

  maxGroupSize: {
    type: Number,
    required: [true, 'maxGroupSize is required']
  },
  difficulty: {
    type: String,
    trim: true,
    required: [true, 'difficulty is required'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'must be easy or medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [1, 'minimum rating is 1'],
    max: [5, 'maximum rating is 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
    min: [0, 'minimum price is 0']
  },
  priceAfterDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) must be less than orginal price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'summary is required']
  },
  description: {
    type: String,
    required: [true, 'summary is required']
  },
  imageCover: {
    type: String,
    required: [true, 'imageCover is required']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
});
tourSchema.pre('save', function() {
  this.slugName = slugify(this.name, { lower: true });
});

tourSchema.pre('aggregate', function() {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});
tourSchema.pre(/^find/, function() {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
});
tourSchema.post(/^find/, function(docs) {
  console.log(`Query took ${Date.now() - this.start} ms`);
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
