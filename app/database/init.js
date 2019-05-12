const Mongoose = require('mongoose');

const { resolve } = require('path');

const glob = require('glob');

Mongoose.Promise = global.Promise;

exports.connect = db => {
    let maxConnectTimes = 0;
    return new Promise(reslove => {
        Mongoose.set('useCreateIndex', true);
        if (process.env.NODE_ENV !== 'production') {
            Mongoose.set('debug');
        }
        Mongoose.connect(db, { useNewUrlParser: true });
        Mongoose.connection.on('disconnect', () => {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                Mongoose.connect(db, { useNewUrlParser: true });
            } else {
                throw new Error('数据库挂了~');
            }
        });
        Mongoose.connection.on('error', err => {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                Mongoose.connect(db, { useNewUrlParser: true });
            } else {
                throw new Error('数据库连接出错了~');
            }
        });
        Mongoose.connection.on('open', () => {
            console.log('MongoDB connected');
            reslove();
        });
    });
};

exports.initSchema = () => {
    console.log('initSchema');
    const schemaFiles = resolve(__dirname, './schema', '**/*.js');
    const globArr = glob.sync(schemaFiles);
    // console.log('globArr: ', globArr);
    // globArr.forEach(item => {
    //     console.log('item: ', item);
    //     require(item);
    // });
    globArr.forEach(require);
};
