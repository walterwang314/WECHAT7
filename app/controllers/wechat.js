const { reply } = require('../../wechat/reply');
const Config = require('../../config');

const api = require('../api/index');

const WeChatMiddleware = require('../../wechat-lib/middleware');
const { getWeChatOAuth } = require('../../wechat/index');

exports.hear = async (context, next) => {
    console.log('controller -> wechat -> hear');
    const Middleware = WeChatMiddleware(Config.wechat, reply);
    await Middleware(context, next);
};

exports.oauth = async (context, next) => {
    console.log('controller -> wechat -> oauth');
    const oauth = getWeChatOAuth();
    let target = Config.BASE_URL + '/userInfo';
    let scope = 'snsapi_userinfo';
    let state = context.query.id;
    
    let url = oauth.getAuthorizeUrl(scope, target, state);

    console.log('AuthorizeUrl: ', url);
    
    context.redirect(url);
};

exports.userInfo = async (context, next) => {
    console.log('controller -> wechat -> userInfo');
    const oauth = getWeChatOAuth();
    const Code = context.query.code;
    console.log('userInfo -> Code: ', Code);
    const data = await oauth.fetchAccessToken(Code);
    console.log('userInfo -> AccessToken: ', data);
    const UserData = await oauth.getUserInfo(data.access_token, data.openid);
    console.log('userInfo -> result -> UserData: ', UserData);
    context.body = UserData;
};

exports.sdk = async (context, next) => {
    console.log('controller -> wechat -> sdk');
    const url = context.href;
    console.log('sdk -> context.href: ', context.href);
    const params = await api.wechat.getSignature(url);

    console.log('controller -> sdk -> params: ', params);

    await context.render('wechat/sdk', params);
};