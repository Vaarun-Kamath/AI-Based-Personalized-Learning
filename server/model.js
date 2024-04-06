const mongoose = require("mongoose");
const { userSchema, physicsSchema } = require("./schema");

module.exports.User = mongoose.model("Users", userSchema);

module.exports.Physics = mongoose.model("Physics", physicsSchema);
