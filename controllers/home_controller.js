const Post = require('../models/post');
const User = require('../models/user');
const Event = require('../models/event');

module.exports.home = async function(request, response){

    try {
        // Populate the user name of the post
        let post = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes');
       


        let users = await User.find({}); 

        let event = await Event.find({});

        return response.render('home', {
            title: "Home",
            post: post,
            all_users: users,
            event: event
        });
    } catch (err) {
        console.log('Error: ', err);
        return;
    }
}