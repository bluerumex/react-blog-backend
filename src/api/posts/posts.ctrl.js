const Post = require('models/post');
const { ObjectId } = require('mongoose').Types;

exports.checkObjectId = (ctx, next) => {
    const { id } = ctx.params;

    if (!ObjectId.isValid(id)) {
        ctx.status = 400;
        return null;
    }

    return next();
};

/*
포스트 작성
POST /api/posts
{ title, body }
*/
exports.write = async (ctx) => {
    const { title, body, tags } = ctx.request.body;
    const post = new Post({
        title, body, tags
    });

    try {
        await post.save();
        ctx.body = post;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

/*
포스트 목록 조회
GET /api/posts
*/
exports.list = async (ctx) => {
    try {
        const posts = await Post.find().exec();
        ctx.body = posts;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

/*
특정 포스트 조회
GET /api/posts/:id
*/
exports.read = async (ctx) => {
    const { id } = ctx.params;
    try {
        const post = await Post.findById(id).exec();
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

/*
특정 포스트 제거
DELETE /api/posts/:id
*/
exports.remove = async (ctx) => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

/*
포스트 수정(교체)
PUT /api/posts/:id
{ title, body }
*/
exports.replace = (ctx) => {
    
};

/*
포스트 수정(특정 필드 변경)
PATCH /api/posts
{ title, body }
*/
exports.update = async (ctx) => {
    console.log('update....');
    const { id } = ctx.params;
    try {
        const post = Post.findByIdAndUpdate(id, request.body, {
            new: true
        }).exec();

        if (!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e) {
        ctx.throw(e, 500);
    }
};
