const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
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

clientSchema.index({ companyId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Client', clientSchema);
