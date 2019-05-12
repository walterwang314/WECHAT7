const config = require('../config');
const WeChatOAuth = require('../wechat-lib/oauth');

const mongoose = require('mongoose');

const Token = mongoose.model('Token');
const Ticket = mongoose.model('Ticket');

const Wechat = require('../wechat-lib/index');



const wechatCfg = {
    wechat: {
        appID: config.wechat.appID,
        appSecret: config.wechat.appSecret,
        token: config.wechat.token,
        getAccessToken: async () => {
            const res = await Token.getAccessToken();
            return res;
        },
        saveAccessToken: async (data) => {
            const res = await Token.saveAccessToken(data);
            return res;
        },
        getTicket: async () => {
            const Res = await Ticket.getTicket();
            return Res;
        },
        saveTicket: async data => {
            const Res = await Ticket.saveTicket(data);
            return Res;
        }, 
    }
};


exports.getWeChat = () => new Wechat(wechatCfg.wechat);
exports.getWeChatOAuth = () => new WeChatOAuth(wechatCfg.wechat);
