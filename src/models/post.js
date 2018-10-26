const mongoose = require('mongoose');

const { Shcema } = mongoose;

const Post = new Shcema({
    title: String,
    body: String,
    tags: [String],
    publishedDate: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Post', Post);