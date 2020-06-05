const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');


// Create Comment
module.exports.create = async function(request, response) {
    
    try {
        let post = await Post.findById(request.body.post)

        if (post) {
            let comment = await Comment.create({
                content: request.body.content,
                post: request.body.post,
                user: request.user._id
            });
                post.comments.push(comment);
                post.save();

                // Similar for comments to fetch the user's id
                comment = await comment.populate('user', 'name email').execPopulate();
                // commentsMailer.newComment(comment);
                let job = queue.create('emails', comment).save(function(err){
                    if(err){console.log('error in creating a queue', err); return;}

                    console.log('job enqueued', job.id);
                });

                if(request.xhr){
                    return response.status(200).json({
                        data: {
                            comment: comment
                        },
                        message: "Comment Created!"
                    });
                }

                request.flash('success', 'Comment Created!');
                response.redirect('/');
        }
    } catch (err) {
        request.flash('error', err);
        return response.redirect('back');
    }
}


// Delete comment from database
module.exports.destroy = async function(request, response) {

    try {
        let comment = await Comment.findById(request.params.id); 

        let post = await Post.findById(comment.post); 
    
        if (comment.user == request.user.id || post.user._id == request.user.id) {
    
            let postId = comment.post;
        
            comment.remove();
        
            await Post.findByIdAndUpdate(postId, { $pull: {comments: request.params.id}});

            // destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            
            request.flash('success', 'Comment Deleted');
            return response.redirect('back');
        }else {
            request.flash('warning', 'You are not Authorized to delete the comment');
            return response.redirect('back');
        }
    } catch (err) {
        request.flash('error', err);
        return response.redirect('back');
    }
}