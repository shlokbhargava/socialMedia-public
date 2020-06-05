{
    // method to submit the form data for new comment using AJAX
    let createComment = function () {
        let newCommentForm = $('#new-comment-form');

        newCommentForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                success: function (data) {
                    let newComment = newCommentDom(data.data.comment);
                    $('#post-comments-list>ul').prepend(newComment);
                    deleteComment($(' .delete-comment-button', newComment));

                    // enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));

                }, error: function (error) {
                    console.log(error.responseText);
                }
            });

        });
    }


    // method to create a comment in DOM
    let newCommentDom = function (comment) {
        return $(`<li id="comment-${comment._id}">
        <p>
        ${ comment.content}
    
                <small>
                    <a class="delete-comment-button" href="/comments/destroy/${ comment._id}">X</a>
                </small>

                <br>
                <small>
                    -${ comment.user.name}
                </small>
                
                <small>
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">0 Likes </a>
                </small>        
        </p>
    </li>`)
    }



    // method to delete a comment in DOM
    let deleteComment = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#comment-${data.data.comment_id}`).remove();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });

        });
    }


    createComment();
}