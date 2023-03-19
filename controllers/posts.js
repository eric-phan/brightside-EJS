const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
// if user is logged i nyou are also sending the user info..
// mult editing, highlight and press ctrl D
// post is a model

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      // go to the model to find the post by the user id
      res.render("profile.ejs", { posts: posts, user: req.user });
      // render the profile page, assign data yo uretrived from the database and sending it down to views (ejs)
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      // .lean removes the unnecessary things from the documents of mongoDB,
      // this makes it faster than vanilla JS (read the documentation of mongoose)
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      // get.params.id gets you the id of the post from the URL
      // id is a query parameter similar to apis
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      // dont need to know this but just the big picture
      // cloudinary is a package, uploader is a method, uploas is another method,
      // req.file.path is the file that multer helped us upload
      // tells where cloudinary to grab the file

      await Post.create({
        // anything with result is referencing cloudinary
        title: req.body.title,
        // comes from mongoDB
        image: result.secure_url,
        // the result comes from cloudinary..
        cloudinaryId: result.public_id,
        // need ID when it comes time for deleting, we can use ID to delete.
        caption: req.body.caption,
        // mongoDB
        likes: 0,
        // hard coded
        user: req.user.id,
      });
      console.log("Post has been added!");
      console.log(result)
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        // find the post that has the userID,
        {
          $inc: { likes: 1 },
          // increment the likes property by 1.
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
