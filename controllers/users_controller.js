const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const resetPasswordToken = require('../models/reset_password');
const usersProfileUpdateMailer = require('../mailers/users_profile_update_mailer');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const userProfileUpdateEmailWorker = require('../workers/user_profile_update_worker');
const queue = require('../config/kue');


// Render Profile Page
module.exports.profile = function(request, response){
    
    User.findById(request.params.id, function(err, user){
        if(err){console.log('error in finding the user profile'); return;}

        return response.render('users_profile', { 
            title: "User Profile",
            profile_user: user
        });
    });
}


// Update User Details
module.exports.update = async function(request, response){

    if (request.user.id == request.params.id) {

        try {
            
            let user = await User.findById(request.params.id);
            User.uploadedAvatar(request, response, function(err){
                if(err){ request.flash('error', err); return response.redirect('back');}

                user.name = request.body.name;
                user.email = request.body.email;

                if(request.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + request.file.filename;
                }

                user.save();

                // usersProfileUpdateMailer.updateProfile(user); 
                let job = queue.create('emails', user).save(function(err){
                    if(err){console.log('error in creating a queue', err); return;}
        
                    console.log('job enqueued', job.id);
                });

                return response.redirect('back');
            })

        } catch (err) {
            request.flash('error', err);
            return response.redirect('back');
        }
        
    } else {
        request.flash('error', 'Unauthorized');
        response.status(401).send('Unauthorized');
    }
}

// Ask Reset Password form
module.exports.askResetPassword = (request, response) => {
    try {
        return response.render('ask_reset_password', {
            title: "Forgot Password?"
        });
    } catch (err) {
        console.log('error in ask reset password', err);
        return;
    }
}

// Reset password request, email the link
module.exports.createPasswordResetRequest = async (request, response) => {
    try {
        let user = await User.findOne({email: request.body.email});

        if (user) {
            let resetToken = await resetPasswordToken.create({
                user: user,
                accesstoken: crypto.randomBytes(20).toString('hex'),
                isValid: true
            });


            if (resetToken) {
               resetPasswordMailer.newPassword(resetToken);
               
               request.flash('success', 'Reset Password link sent successfully');
               return response.redirect('back');

            } else {
                console.log('accessToken not generated', err);
                return;
            }

        } else {
            request.flash('error', 'The entered email id is not registered');
            return response.redirect('back');
        }
    } catch (err) {
        console.log('error in creating a password reset request', err);
        return;
    }
}

// Show Password reset form
module.exports.showPasswordResetForm = async (request, response) => {
    try {

        let resetToken = await resetPasswordToken.findById(request.params.id);

        console.log('show password reset form', resetToken);

        return response.render('new_password', {
            title: "Reset Password",
            resetToken: resetToken
        });
    } catch (err) {
        console.log('error in show new password form', err);
        return;
    }
}

// Set new Password
module.exports.setNewPassword = async (request,response) => {
    try {
        if(request.body.new_password != request.body.confirm_new_password){
            return response.redirect('back');
        }

        let resetToken = await resetPasswordToken.findById(request.params.id);

        console.log('reset token is', resetToken);

        if(resetToken){
            if (resetToken.isValid != false) {
                let user = await User.findById(resetToken.user);

                console.log('set new password user', user);
        
                user.password = request.body.new_password;
        
                user.save();

                resetToken.isValid = false;

                resetToken.save();

                console.log('display isValid', resetToken.isValid);

                request.flash('success', 'Password changed. Login again');
                return response.redirect('back');

            } 
        }
    
    } catch (err) {
        console.log('error in setting new password', err);
        return;
    }
}


// Adding Event
module.exports.event = async function(request, response){
    try {
        let user = await User.findById(request.params.id);

        user.event.description = request.body.description;
        user.event.date = request.body.date;

        user.save();
        return response.redirect('back');
    } catch (err) {
        request.flash('error', err);
        return response.redirect('back');
    }
}


// Render Sign Up Page
module.exports.signUp = function(request, response){

    if(request.isAuthenticated()){
        return response.redirect('/');
    }

    return response.render('user_sign_up', {
        title: "Sign Up"
    });
}

// Render Sign In Page
module.exports.signIn = function(request, response){

    if(request.isAuthenticated()){
        return response.redirect('/');
    }

    return response.render('user_sign_in', {
        title: "Sign In" 
    })
}

// get the sign up data
module.exports.create = function(request, response){
    if(request.body.password != request.body.confirm_password){
        return response.redirect('back')
    }

    User.findOne({email: request.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return;}

        if(!user){
            User.create(request.body, function(err, user){
                if(err){request.flash('error', 'User not Created'); return response.redirect('back');}

                request.flash('success', 'User Created Successfully');
                return response.redirect('/users/signin');
            })
        }else{
            request.flash('error', 'User already exists');
            return response.redirect('back');
        }

    }); 
}

// sign  in and create a session for the user
module.exports.createSession = function(request, response){
    request.flash('success', 'Logged in Successfully');
    return response.redirect('/');
}


// signing out
module.exports.destroySession = function(request, response){
    request.logout();
    request.flash('success', 'You have Logged Out!');

    return response.redirect('/users/signin');
}