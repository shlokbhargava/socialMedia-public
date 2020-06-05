const nodeMailer = require('../config/nodemailer');


exports.updateProfile = (user) => {

    let htmlString = nodeMailer.renderTemplate({user: user}, '/users/update_profile.ejs');

    nodeMailer.transporter.sendMail({
        from: '******',
        to: user.email, 
        subject: "Profile Details Updated",
        html: htmlString
    }, (err, info) => {
        if(err){console.log('error in sending the mail', err); return;}

        console.log('Mail delivered', info);
        return;
    });
}