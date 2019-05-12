const Config = require('../config');
const WeChat = require('../app/controllers/wechat');

const User = require('../app/controllers/user/index');
const Index = require('../app/controllers/index');
const KoaBody = require('koa-body');

const Category = require('../app/controllers/category');
const Movie = require('../app/controllers/movie');
const Comment = require('../app/controllers/movie/comment');

module.exports = router => {
    // router.get(Config.BASE_URL + '/', Index.homePage);

    // const hearUrl = Config.BASE_URL + '/wx-hear';

    router.get('/', Index.homePage);
    router.get('/sdk', WeChat.sdk);

    // 用户的注册登录路由
    router.get('/user/signup', User.showSignUp);
    router.get('/user/signin', User.showSignIn);

    router.post('/user/signup', User.signUp);
    router.post('/user/signin', User.signIn);

    router.get('/logout', User.logOut);

    router.get('/admin/user/list', User.signInRequired, User.adminRequired,  User.list);

    router.get('/wx-hear', WeChat.hear);
    router.post('/wx-hear', WeChat.hear);

    router.get('/wx-oauth', WeChat.oauth);
    router.get('/userInfo', WeChat.userInfo);
    // router.get(Config.URL_PREFIX + '/sdk', WeChat.sdk);
    // router.post(Config.URL_PREFIX + '/wechat/signature', WeChat.getSdkSignature);

    // router.get(Config.URL_PREFIX + '/user/signUp', User.showSignUp);
    // router.get(Config.URL_PREFIX + '/user/signIn', User.showSignIn);
    // router.post(Config.URL_PREFIX + '/user/signUp', User.signUp);
    // router.post(Config.URL_PREFIX + '/user/signIn', User.signIn);
    // router.get(Config.URL_PREFIX + '/user/logOut', User.logOut);
    // router.get(Config.URL_PREFIX + '/admin/user/list', User.signInRequired, User.adminRequired, User.list);
    // router.delete(Config.URL_PREFIX + '/admin/user', User.signInRequired, User.adminRequired, User.del);

    router.get(Config.URL_PREFIX + '/admin/movie/category/show', User.signInRequired, User.adminRequired, Category.show);
    router.get(Config.URL_PREFIX + '/admin/movie/category/update/:_id', User.signInRequired, User.adminRequired, Category.show);
    router.post(Config.URL_PREFIX + '/admin/movie/category', User.signInRequired, User.adminRequired, Category.new);
    router.delete(Config.URL_PREFIX + '/admin/movie/category', User.signInRequired, User.adminRequired, Category.del);
    router.get(Config.URL_PREFIX + '/admin/movie/category/list', User.signInRequired, User.adminRequired, Category.list);

    
    router.get(Config.URL_PREFIX + '/movie/detail/:_id', Movie.detail);
    router.post(Config.URL_PREFIX + '/movie/comment', User.signInRequired, Comment.save);
    router.get(Config.URL_PREFIX + '/movie/search', Movie.search);
    router.get(Config.URL_PREFIX + '/admin/movie/show', User.signInRequired, User.adminRequired, Movie.show);
    router.get(Config.URL_PREFIX + '/admin/movie/update/:_id', User.signInRequired, User.adminRequired,Movie.show);
    router.post(Config.URL_PREFIX + '/admin/movie', User.signInRequired, User.adminRequired, KoaBody({ multipart: true }), Movie.savePoster, Movie.new);
    router.get(Config.URL_PREFIX + '/admin/movie/list', User.signInRequired, User.adminRequired, Movie.list);
    router.delete(Config.URL_PREFIX + '/admin/movie', User.signInRequired, User.adminRequired, Movie.del);
};