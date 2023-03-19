const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// created a schema calle PostSchema

module.exports = mongoose.model("Post", PostSchema);
// we are making a model and giving it a name called post
// -the schema is like the blueprint
// mongoose wil automatically make a new collection for you, can specify it as the third argument
// if not, it will automatically make one in the plural form of the model, 'posts'
