const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }

}, {
    timestamps: true
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});


// static Methods
userSchema.statics.uploadedAvatar = multer({
    storage: storage,
    limits: { fileSize: 0.1*1000*1000 },
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

// check file type
function checkFileType(file, cb){
    // Allowed extensions
    const fileTypes = /jpeg|jpg|png|gif/;

    // check extension
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    // check mimetype
    const mimetype = fileTypes.test(file.mimetype);

    if(mimetype && extName){
        return cb(null, true);
    }else{
        cb('Please upload only images.');
    }

    // if (file.mimetype.startsWith("image")) {
    //     cb(null, true);
    //   } else {
    //     cb("Please upload only images.", false);
    //   }
}


const User = mongoose.model('User', userSchema);

module.exports = User;
