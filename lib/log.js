/**
 * Logger adapter
 * Created by liangyali on 14-11-19.
 */

var pine = require('pine');

pine.configure({
    transports: {
        console: {
            level: 'debug'
        }
    }
});

module.exports = function (name, options) {
    return pine(name, options);
};
