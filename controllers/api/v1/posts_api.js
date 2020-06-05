const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(request, response){

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });


    return response.json(200, {
        message: "List of posts",
        posts: posts
    });
}

// Deleting post from the database
module.exports.destroy = async function(request, response) {
    
    try {
        let post = await Post.findById(request.params.id);
    
        // .id means converting the object id into string 
        // performing user authentication
        if (post.user == request.user.id) {
            post.remove();
    
            await Comment.deleteMany({post: request.params.id});

            
            return response.json(200, {
                message: "Post and associated comments deleted!"
            });
            
        }else{
            return response.json(401, {
                message: "You cannot delete the post!"
            });
        }
    } catch (err) {
        console.log('********posts_api', err);
        return response.json(500, {
            message: "Internal Server Error"
        });
    }
}