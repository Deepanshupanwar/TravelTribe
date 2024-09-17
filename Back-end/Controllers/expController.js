const User = require('../Models/UserTraveller');
const ExperienceBlog = require('../Models/ExperienceBlog');
const cloudinary = require('../Config/cloudinaryConfig')

exports.submit  = async (req,res) =>{
    try{
        const {title, location, visit_time, content, description} = req.body;
        const {userId} = req.user;
        const upload = await cloudinary.v2.uploader.upload(req.file.path);
        const expblog = await ExperienceBlog.create({
            author: userId,
            title,
            content,
            cover: upload.secure_url,
            location,
            visit_time,
            description
        })
        res.status(200).json(expblog)
    }
    catch(e){
            res.status(500).json({message: "internal server error"})
    }

}

exports.update  = async (req,res) =>{
    try {
        const { id } = req.params; 
        const { title, location, visit_time, content, description } = req.body;
        const updatedBlog = await ExperienceBlog.findByIdAndUpdate(id, {
            title,
            content,
            location,
            visit_time,
            description
        }, { new: true }); // Return the updated document
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(updatedBlog);
    } catch (e) {
        res.status(500).json({ message: "internal server error" });
    }
}

exports.deleteExp  = async (req,res) =>{
    try {
        const { id } = req.params; 
        const deletedBlog = await ExperienceBlog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: "internal server error" });
    }
}

exports.like  = async (req,res) =>{
    try {
        const { id } = req.params; 
        const { userId } = req.user; 
        const blog = await ExperienceBlog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (!blog.liked_by.includes(userId)) {
            blog.likes_count++;
            blog.liked_by.push(userId);
            await blog.save();
        }
        res.status(200).json(blog);
    } catch (e) {
        res.status(500).json({ message: "internal server error" });
    }
}

exports.unlike  = async (req,res) =>{
    try {
        const { id } = req.params; 
        const { userId } = req.user; 
        const blog = await ExperienceBlog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (blog.liked_by.includes(userId)) { //unlike if user have liked it before
            blog.likes_count--;
            blog.liked_by.pull(userId);
            await blog.save();
        }
        res.status(200).json(blog);
    } catch (e) {
        res.status(500).json({ message: "internal server error" });
    }
}


exports.getAll = async (req, res) => {
    try {
        const blogs = await ExperienceBlog.find().sort({ createdAt: -1 }); // Sort by latest
        res.status(200).json(blogs);
    } catch (e) {
        res.status(500).json({ message: "internal server error" });
    }
}

exports.getById = async (req, res) => {
    try {
        const { id } = req.params; // id is the author's user ID
        const blogs = await ExperienceBlog.find({ author: id }).sort({ createdAt: -1 }); // Sort by latest
        if (blogs.length === 0) {
            return res.status(404).json({ message: "No blogs found for this author" });
        }
        res.status(200).json(blogs);
    } catch (e) {
        res.status(500).json({ message: "internal server error" });
    }
}

exports.getByLocation = async (req, res) => {
    try {
        const { city, country } = req.query; //location is passed as query params
        const blogs = await ExperienceBlog.find({
            'location.city': city,
            'location.country': country
        }).sort({ createdAt: -1 }); // Sort by latest
        res.status(200).json(blogs);
    } catch (e) {
        res.status(500).json({ message: "internal server error" });
    }
}