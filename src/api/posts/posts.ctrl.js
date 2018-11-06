const Post = require('models/post');

const { ObjectId } = require('mongoose').Types;
const Joi = require('joi');

exports.checkObjectId = (ctx, next) => {
    const {
        id
    } = ctx.params;

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
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const {
        title,
        body,
        tags
    } = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags
    });

    try {
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(e, 500);
    }
};

/*
포스트 목록 조회
GET /api/posts
*/
exports.list = async (ctx) => {
    const page = parseInt(ctx.query.page || 1, 10);
    const {
        tag
    } = ctx.query;

    const query = tag ? {
        tags: tag
    } : {};

    if (page < 1) {
        ctx.status = 400;
        return;
    }

    try {
        const posts = await Post.find(query)
            .sort({
                _id: -1
            })
            .limit(10)
            .skip((page - 1) * 10)
            .lean()
            .exec();
        const postCount = await Post.count(query).exec();
        const limitBodyLength = post => ({
            ...post,
            body: post.body.lenth < 350 ?
                post.body :
                `${post.body.slice(0, 350)}...`
        });
        ctx.body = posts.map(limitBodyLength);
        ctx.set('Last-page', Math.ceil(postCount / 10));
    } catch (e) {
        ctx.throw(e, 500);
    }
};

/*
특정 포스트 조회
GET /api/posts/:id
*/
exports.read = async (ctx) => {
    const {
        id
    } = ctx.params;
    try {
        const post = await Post.findById(id).exec();
        if (!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(e, 500);
    }
};

/*
특정 포스트 제거
DELETE /api/posts/:id
*/
exports.remove = async (ctx) => {
    const {
        id
    } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch (e) {
        ctx.throw(e, 500);
    }
};

/*
포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{ title, body, tags }
*/
exports.update = async (ctx) => {
    const { id } = ctx.params;

    try {
        const post = Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true
        }).exec();

        if (!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(e, 500);
    }
};