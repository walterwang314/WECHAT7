const Koa = require('koa');
const Router = require('koa-router');
const moment = require('moment');

const path = require('path');

const bodyParse = require('koa-bodyparser');
const session = require('koa-session');
const Mongoose = require('mongoose')

const config = require('./config/index');

// const WeChatController = require('./app/controllers/wechat');

const { initSchema, connect } = require('./app/database/init');


(async function() {
    
    await connect(config.db);
    
    initSchema();
    
    const app = new Koa();
    const router = new Router();

    const views = require('koa-views');

    // Must be used before any router is used
    app.use(views(path.resolve(__dirname, './app/views'), {
        extension: 'pug',
        options: {
            moment: moment
        }
    }));

    app.keys = ['imooc'];
    app.use(session(app));
    app.use(bodyParse());

    app.use(async (context, next) => {
        const UserModel = Mongoose.model('User');
        let user = context.session.user;
        if (user && user._id) {
          user = await UserModel.findOne({ _id: user._id });
          if (user) {
            context.session.user = {
              _id: user._id,
              nickname: user.nickname,
              role: user.role,
            };
            context.state = Object.assign(context.state, {
              user: {
                _id: user._id,
                nickname: user.nickname,
              },
            });
          }
        } else {
          context.session.user = null;
        }
        await next();
    });



    require('./config/routes')(router);

    app.use(router.routes()).use(router.allowedMethods());

    // app.use(wechat(config.wechat, reply));
    
    app.listen(config.port);
    
    console.log('listen on 3007');
})();


