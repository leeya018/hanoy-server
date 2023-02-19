const mongoose = require('mongoose');

const RecSchema = new mongoose.Schema({
  level: {type: Number, required: true},
  time: {type: Number, required: true},
});

const ScoreSchema = new mongoose.Schema({
  records: {type: [Object], required: true}, //level + time
  country: {type: String, required: true},
  username: {type: String, required: true},
});
// this is I do not want to get the err that its all ready created
module.exports = mongoose.models.Score || mongoose.model('Score', ScoreSchema);
