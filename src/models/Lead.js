const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
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
    source: {
      type: String,
      enum: ['facebook', 'whatsapp', 'website'],
      required: true
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted'],
      default: 'new'
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false
  }
);

module.exports = mongoose.model('Lead', leadSchema);
