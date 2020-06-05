const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const postsMailer = require('../mailers/posts_mailer');
const postEmailWorker = require('../workers/post_email_worker');
const queue = require('../config/kue');



// Create Post
module.exports.create = async function(request, response){
    try {
        let post = await Post.create({
            content: request.body.content,
            user: request.user._id
        });

        post = await post.populate('user', 'name email').execPopulate();
        // postsMailer.newPost(post);

        let job = queue.create('emails', post).save(function(err){
            if(err){console.log('error in creating a queue', err); return;}

            console.log('job enqueued', job.id);
        });
    
        if(request.xhr){
            return response.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }
    
        request.flash('success', 'Post Published!');
        return response.redirect('back');

    } catch (err) {
        console.log('Error:', err);
        return response.redirect('back');
    }
}


// Deleting post from the database
module.exports.destroy = async function(request, response) {
    
    try {
        let post = await Post.findById(request.params.id);
    
        // .id means converting the object id into string 
        // performing user authentication
        if (post.user == request.user.id) {

            // delete the associated likes for the post and all its comments likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            // deleting multiple ids
            await Like.deleteMany({_id: {$in: post.comments}}); 

            post.remove();
    
            await Comment.deleteMany({post: request.params.id});

            if(request.xhr){
                return response.status(200).json({
                    data: {
                        post_id: request.params.id
                    },
                    message: "Post Deleted!"
                });
            }
            
            request.flash('success', 'Post and associated Comments Deleted');
            return response.redirect('back');
            
        }else{
            request.flash('warning', 'You are not Authorized to delete the Post');
            return response.redirect('back');
        }
    } catch (err) {
        request.flash('error', err);
        return response.redirect('back');
    }
}