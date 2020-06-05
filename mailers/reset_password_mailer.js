const nodeMailer = require('../config/nodemailer');


exports.newPassword = (resetToken) => {

    let htmlString = nodeMailer.renderTemplate({resetToken: resetToken}, '/users/reset_password.ejs');

    nodeMailer.transporter.sendMail({
        from: '******',
        to: resetToken.user.email, 
        subject: "Reset Password",
        html: htmlString 
    }, (err, info) => {
        if(err){console.log('error in sending the mail', err); return;}

        console.log('Mail delivered', info);
        return;
    });
}