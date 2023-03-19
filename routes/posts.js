const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
// multer facilitates the image upload to cloudinary 
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);
// :/id sets up a query parameter to grab the value out of the url
// ensure that it is authenticated, then go to the postController and USE the getPost method
// NOT hardcoded,can use this for every single post, just like a fx can take in a valuem this is the same thing!
// values you are passing in are IDs

router.post("/createPost", upload.single("file"), postsController.createPost);
// middleware upload, is requiring you to use multer(upload)
// handles checking the uploading of the file
// use createPost from contollers/posts

router.put("/likePost/:id", postsController.likePost);

router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
