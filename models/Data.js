const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  ldr: Number,
  pir: Boolean,
  vib: Boolean,
  button: Boolean,
  sound: Boolean,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Data', DataSchema);
