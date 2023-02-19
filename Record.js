const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  level: {type: Number, required: true},
  time: {type: Number, required: true},
  username: {type: String, required: true},
  country: {type: String, required: true},
});
// this is I do not want to get the err that its all ready created
module.exports =
  mongoose.models.Record || mongoose.model('Record', RecordSchema);
