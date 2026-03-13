const TourModel = require('../models/tourModel');
const asyncWrapper = require('../middleware/asyncWrapper');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require(`${__dirname}/../utils/AppError`);
const aliasTopTours = (req, res, next) => {
  if (!req.query.sort) {
    req.query.sort = '-ratingsAverage,price';
  }
  if (!req.query.fields) {
    req.query.fields = 'name,price,ratingsAverage';
  }
  next();
};

const getTourStats = asyncWrapper(async (req, res) => {
  const stats = await TourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        totalTour: { $sum: 1 },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        totalRating: { $sum: '$ratingsQuantity' }
      }
    },
    {
      $sort: { totalRating: -1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
const getMonthlyPlan = asyncWrapper(async (req, res) => {
  const year = req.params.year;
  const plan = await TourModel.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { month: 1 }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

const getAllTours = asyncWrapper(async (req, res) => {
  let features = new ApiFeatures(TourModel.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

const getTour = asyncWrapper(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await TourModel.findById(tourId);
  if (!tour) {
    return next(new AppError('This tour not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

const createTour = asyncWrapper(async (req, res) => {
  const {
    name,
    duration,
    maxGroupSize,
    difficulty,
    ratingsAverage,
    ratingsQuantity,
    price,
    summary,
    description,
    imageCover,
    images,
    startDates,
    secretTour,
    priceAfterDiscount
  } = req.body;
  const tour = await TourModel.create({
    name,
    duration,
    maxGroupSize,
    difficulty,
    ratingsAverage,
    ratingsQuantity,
    price,
    summary,
    description,
    imageCover,
    images,
    startDates,
    secretTour,
    priceAfterDiscount
  });
  res.status(201).json({ status: 'success', data: tour });
});

const updateTour = asyncWrapper(async (req, res) => {
  const tourId = req.params.id;
  const tour = await TourModel.findByIdAndUpdate(tourId, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
});

const deleteTour = asyncWrapper(async (req, res) => {
  const tourId = req.params.id;
  const tour = await TourModel.findByIdAndDelete(tourId);
  res.status(204).send();
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
};
