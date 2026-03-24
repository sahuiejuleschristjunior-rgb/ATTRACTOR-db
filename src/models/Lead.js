const mongoose = require('mongoose');

const leadStatusHistorySchema = new mongoose.Schema(
  {
    from: {
      type: String,
      enum: ['new', 'contacted', 'converted'],
      default: null
    },
    to: {
      type: String,
      enum: ['new', 'contacted', 'converted'],
      required: true
    },
    changedBy: {
      type: String,
      required: true,
      trim: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

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
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null
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
    },
    assignedTo: {
      type: String,
      trim: true,
      default: null
    },
    statusHistory: {
      type: [leadStatusHistorySchema],
      default: []
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    },
    updatedBy: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false
  }
);

leadSchema.index({ companyId: 1, phone: 1 });
leadSchema.index({ companyId: 1, email: 1 });
leadSchema.index({ companyId: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
