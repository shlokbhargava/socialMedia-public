const nodeMailer = require('../config/nodemailer');



exports.newPost = (post) => {

    let htmlString = nodeMailer.renderTemplate({post: post}, '/posts/new_post.ejs');

    nodeMailer.transporter.sendMail({
        from: 'project.cn20@gmail.com',
        to: post.user.email, 
        subject: "New Post Published",
        html: htmlString 
    }, (err, info) => {
        if(err){console.log('error in sending the mail', err); return;}

        console.log('Mail delivered', info);
        return;
    });
}
