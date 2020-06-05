const Event = require('../models/event');

module.exports.create = async function (request, response) {
    try {
        let event = await Event.create({
            description: request.body.description,
            date: request.body.date,
            user: request.user._id
        });

        request.flash('success', 'Events added');
        return response.redirect('back');
    } catch (err) {
        console.log('error in creating an event', err);
        return response.redirect('back');
    }
}


module.exports.destroy = async function (request, response) {
    try {
        let event = await Event.findById(request.params.id);

        if (event.user == request.user.id) {
            event.remove();

            request.flash('success', 'Event deleted');
            return response.redirect('back');
        } else {
            request.flash('warning', 'You are not Authorized to delete the Event');
            return response.redirect('back');
        }
    } catch (err) {
        request.flash('error', err);
        return response.redirect('back');
    }
}