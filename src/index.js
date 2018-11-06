require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const session = require('koa-session');
const api = require('./api');

const app = new Koa();
const router = new Router();

const {
    PORT: port = 4000,
    MONGO_URI: mongoURI,
    COOKIE_SIGN_KEY: signKey
} = process.env;

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI).then(() => {
    console.log('connect to mongodb');
}).catch((e) => {
    console.error(e);
});

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용

app.use(bodyParser());

const sessionConfig = {
    maxAge: 86400000, // 하루
    // signed: true (기본으로 설정되어 있음)
};

app.use(session(sessionConfig, app));
app.keys = [signKey];

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log('listening to port', port);
});
