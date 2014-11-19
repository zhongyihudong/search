/**
 * Created by liangyali on 14-11-19.
 */

var elasticsearch = require('elasticsearch');
var config = require('config');
var log = require('./log')('elasticsearch');

var options = config.get('elasticsearch');

log.debug('elastic config : %s', JSON.stringify(options, null, ' '));

var client = new elasticsearch.Client(options);

module.exports = client;
