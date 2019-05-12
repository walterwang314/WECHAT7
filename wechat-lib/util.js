const xml2js = require('xml2js');
const template = require('./tpl');
const Sha1 = require('sha1');

exports.parseXML = xml => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {trim: true}, (err, content) => {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        })
    })
}

exports.formatMessage = result => {
    let message = {};

    if (typeof result === 'object') {
        const keys = Object.keys(result);

        for (let i = 0; i < keys.length; i++) {
            let item = result[keys[i]];
            let key = keys[i];

            if (!(item instanceof Array) || item.length === 0) {
                continue;
            }

            if (item.length === 1) {
                let val = item[0];

                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                } else {
                    message[key] = (val || "").trim();
                }
            } else {
                message[key] = [];
                for (let j = 0; j < item.length; j++) {
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }
    return message;
}


exports.tpl = (content, message) => {
    let type = 'text';

    if (Array.isArray(content)) {
        type = 'news';
    }

    if (!content) {
        content = 'Empty News';
    }

    if (content && content.type) {
        type = content.type;
    }

    let info = Object.assign({}, {
        content: content,
        msgType: type,
        createTime: new Date().getTime(),
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName
    });

    return template(info);
}


const createNonce = () => {
    return Math.random().toString(36).substr(2, 16);
};

const createTimestamp = () => {
    return parseInt(new Date().getTime() / 1000, 10) + '';
};

const signIt = (args) => {
    let keys = Object.keys(args).sort();
    let newArgs = {};
    let str = '';
    keys.forEach(key=>{
        newArgs[key.toLowerCase()] = args[key];
    });
    for(let k in newArgs){
        str += "&" + k + '=' + newArgs[k];
    }
    return str.substr(1);
};

// 字典排序
const shaIt = (noncestr, ticket, timestamp, url) => {
    const Ret = {
        jsapi_ticket: ticket,
        nonceStr: noncestr,
        timestamp: timestamp,
        url,
    };
    const Str = signIt(Ret);
    const Sha = Sha1(Str);
  
    return Sha;
};

const Sign = (ticket, url) => {
    let noncestr = createNonce();
    let timestamp = createTimestamp();
    let signature = shaIt(noncestr, ticket, timestamp, url);
    return {
        noncestr,
        timestamp,
        signature,
    };
};

exports.Sign = Sign;