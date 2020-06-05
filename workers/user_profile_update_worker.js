const queue = require('../config/kue');

const usersProfileUpdateMailerMailer = require('../mailers/users_profile_update_mailer');


queue.process('emails', function(job, done){
    console.log('emails worker is processing a job', job.data);

    usersProfileUpdateMailerMailer.updateProfile(job.data);

    done();
});