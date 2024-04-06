const mongoose = require("mongoose");

module.exports.userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  username: String,
});
module.exports.physicsSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: Object, required: true },
  answer: { type: String, required: true },
  reason: { type: String, required: true },
  topic: { type: String, required: true },
});
