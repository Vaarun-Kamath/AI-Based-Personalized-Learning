const mongoose = require("mongoose");
const { userSchema, physicsSchema, examSchema } = require("./schema");

module.exports.User = mongoose.model("Users", userSchema);

module.exports.Physics = mongoose.model("Physics", physicsSchema);

module.exports.exam = mongoose.model("exam", examSchema);
