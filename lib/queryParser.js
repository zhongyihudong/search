/**
 * 搜索请求查询转化器
 */

var _ = require('lodash');

var QueryParser = function () {
    this.parsers = [];
};

/**
 * 添加Parser
 * @param parser Function(query,next)
 */
QueryParser.prototype.use = function (parser) {
    if (typeof  parser !== 'function') {
        throw  new Error('parser must be function');
    }
    this.parsers.push(parser);
};

QueryParser.prototype.parse = function (query) {

};
