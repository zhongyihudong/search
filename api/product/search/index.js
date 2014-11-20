/**
 * 商品搜索接口API
 *
 * Created by liangyali on 14-11-19.
 */

var client = require('../../../lib/ESClient');
var log = require('../../../lib/log')('elasticsearch');

var _ = require('lodash');

/**
 * 转化请求参数
 * @param query
 */
function queryParser(query) {
    var result = {
        query: {
            bool: {must: []}
        },
        from: query.from || 0,
        size: query.size || 10
    };

    var termFields = ['category_id' , 'brand_id' , 'suppiler_id', 'publish_status', 'q'];

    var termParser = function (query, field) {
        if (query[field]) {
            var queryItem = {"term": {}};
            queryItem.term[field] = query[field];
            return queryItem;
        }

        return null;
    };

    /**
     * 处理所有的Term查询提条件
     */
    termFields.forEach(function (rule) {
        var item = termParser(query, rule);
        if (item !== null) {
            result.query.bool.must.push(item);
        }
    });

    /**
     * 处理Levels，
     * 需求：小于等于等级的商品
     */
    if (query['levels']) {
        result.query.bool.must.push({
            "range": {
                "levels": {
                    "lte": query.levels
                }
            }
        });
    }

    return result;
}

module.exports = function (router) {
    router.get('/', function (req, res) {

        var query = queryParser(req.query);

        log.debug(JSON.stringify(query));

        client.search({
            index: 'product',
            type: 'products',
            body: query
        }, function (err, result) {

            if (err) {
                res.json({status: false, message: err.message});
                return;
            }

            /**
             * 商品总数
             * @type {*|List.total|Function|module.Holder.total|Runner.total}
             */
            var total = result.hits.total;

            /**
             * 商品列表
             */
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
