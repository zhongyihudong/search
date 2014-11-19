/**
 * 商品搜索接口API
 *
 * Created by liangyali on 14-11-19.
 */

var client = require('../../../lib/ESClient');
var log = require('../../../lib/log')('elasticsearch');
var _ = require('lodash');

module.exports = function (router) {
    router.post('/', function (req, res) {
        res.json({status: 'ok'});
    });

    router.get('/', function (req, res) {

        client.search({
            index: 'product',
            type: 'products',
            body: {
                query: {
                    match_all: {}
                }
            }
        }, function (err, result) {

            if (err) {
                log.error(err);
                res.json({status: false, message: err.message});
                return;
            }

            var total = result.hits.total;

            var products = _.map(result.hits.hits, function (product) {
                return product._source;
            });

            res.json({status: true, data: {
                total: total,
                data: products
            }});
        });

    });
};
