/**
 * Logger adapter
 * Created by liangyali on 14-11-19.
 */

var pine = require('pine');
var config = require('config');

pine.configure({
    transports: {
        console: {
            level: config.get('log').level
        }
    }
});

module.exports = function (name, options) {
    return pine(name, options);
};
