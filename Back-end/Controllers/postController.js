const User = require('../Models/UserTraveller')
const TravelBuddyPost = require('../Models/TravelBuddyPost');

exports.submit = async (req,res)=>{ 
    try{
        const {id, destination, start_date, end_date, description, preferred_gender, budget_range} = req.body;
        //creating a new post
        const post = await TravelBuddyPost.Create({
            user_id: id,
            destination,
            start_date,
            end_date,
            description,
            preferred_gender,
            budget_range
        });
        
        // Add the newly created post ID to the user's posts array
        await User.findByIdAndUpdate(id, { $push: { posts: post._id } });

        res.status(201).json(post);
    }
    catch(e){
        res.status(501).json({message:"server error"})
    }
}

exports.update = async (req,res)=>{ 
    try{
        const { id, destination, start_date, end_date, description, preferred_gender, budget_range } = req.body;
        const updatedPost = await TravelBuddyPost.findByIdAndUpdate(id, {
            destination,
            start_date,
            end_date,
            description,
            preferred_gender,
            budget_range
        }, { new: true });
        res.status(200).json(updatedPost);
    }
    catch(e){
        res.status(501).json({message:"server error"})
    }
}

exports.getAll = async (req,res)=>{ 
    try{
        const posts = await TravelBuddyPost.find();
        res.status(200).json(posts);
    }
    catch(e){
        res.status(501).json({message:"server error"})
    }
}

exports.deletePost = async (req,res)=>{ 
    try{
        const { id } = req.params;
        //delete post
        const post = await TravelBuddyPost.findByIdAndDelete(id);
        //delete from user's post array
        const user = await User.findByIdAndUpdate(post.user_id, { $pull: { posts: id } });
        res.status(204).send(user);
    }
    catch(e){
        res.status(501).json({message:"server error"})
    }
}

exports.searchByLocation = async (req,res)=>{ 
    try{
        const { city, country } = req.query; // Extract city and country from query
        const posts = await TravelBuddyPost.find({ 
            'destination.city': city, 
            'destination.country': country 
        });
        res.status(200).json(posts);
    }
    catch(e){
        res.status(501).json({message:"server error"})
    }
}

exports.searchByDate = async (req,res)=>{ 
    try{
        const { start_date, end_date } = req.query;
        const posts = await TravelBuddyPost.find({
            start_date: { $gte: new Date(start_date) },
            end_date: { $lte: new Date(end_date) }
        });
        res.status(200).json(posts);
    }
    catch(e){
        res.status(501).json({message:"server error"})
    }
}