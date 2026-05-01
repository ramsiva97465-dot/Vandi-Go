const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  fareAmount: { type: Number, required: true },
  tripType: { type: String, enum: ['One way', 'Round trip'], required: true },
  carType: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  bookingDateTime: { type: Date, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'Accepted', 'Started', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);
