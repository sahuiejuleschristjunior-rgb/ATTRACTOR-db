const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['prospect', 'client', 'lost'],
      default: 'prospect'
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false
  }
);

module.exports = mongoose.model('Client', clientSchema);
