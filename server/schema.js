const mongoose = require('mongoose');

module.exports.userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  username: String,
  probability: [[Number]],
  currentExam: String,
  topics: Object,
});
module.exports.physicsSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: Object, required: true },
  answer: { type: String, required: true },
  reason: { type: String, required: true },
  topic: { type: String, required: true },
  Level: { type: String, required: true },
});
module.exports.examSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    questions: { type: Array, required: true },
    selectedOptions: { type: Array, required: true },
    subject: { type: String, required: true },
    probability: [[Number]],
  },
  {
    timestamps: true,
  }
);
