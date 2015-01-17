/**
 * 商品搜索接口API
 *
 * Created by liangyali on 14-11-19.
 */

var client = require('../../../lib/ESClient');
var log = require('../../../lib/log')('elasticsearch');

var _ = require('lodash');

/**
 * 处理分类聚合实体作为分割符号进行处理
 * @type {string}
 */
var SPLIT = '__split__%_';

/**
 * 转化请求参数
 * @param query
 */
function queryParser(query) {

    var result = {
        query: {
            bool: {must: []}
        },
        facets: {},
        from: query.from || 0,
        size: query.size || 10,
        sort: query.sort || {}
    };

    var termFields = ['category_id' , 'brand_id' , 'suppiler_id', 'publish_status'];

    var termParser = function (query, field) {
        if (query[field]) {
            var queryItem = {"term": {}};
            queryItem.term[field] = query[field];
            return queryItem;
        }

        return null;
    };

    /**--------------------------------------------
     * 处理所有的Term查询提条件
     --------------------------------------------*/
    termFields.forEach(function (rule) {
        var item = termParser(query, rule);
        if (item !== null) {
            result.query.bool.must.push(item);
        }
    });

    /**--------------------------------------------
     * 处理价格区间
     --------------------------------------------*/
    if (query['price_range']) {

        var priceRange = {
            range: {
                'sale_price': {

                }
            }
        };
        if (query['price_range'].from) {
            priceRange.range.price.from = query['price_range'].from;
        }

        if (query['price_range'].to) {
            priceRange.range.price.to = query['price_range'].to;
        }
        result.query.bool.must.push(priceRange);
    }

    /**--------------------------------------------
     * 处理Levels，
     * 需求：小于等于等级的商品
     --------------------------------------------*/
    if (query['level']) {
        result.query.bool.must.push({
            "range": {
                "level": {
                    "lte": query.level
                }
            }
        });
    }

    /**--------------------------------------------
     * 处理q , 不传参数获取所有数据
     --------------------------------------------*/
    if (query['q']) {
        result.query.bool.must.push({
            "match": {
                "q": {
                    "query": query.q,
                    "operator": "and"
                }
            }
        });
    } else {
        result.query.bool.must.push({
            "match_all": {}
        });
    }

    /**--------------------------------------------
     * 处理价格区间Facets
     * 说明：
     * 参入参数
     * {
     *      facet_price_ranges:[{
     *          to:50
     *      },{
     *          from:51 , to:200
     *      }]
     * }
     --------------------------------------------*/

    if (query['facet_price_ranges'] && query['facet_price_ranges'] !== null) {
        result.facets['price_ranges'] = {
            range: {
                field: 'sale_price',
                ranges: query['facet_price_ranges']
            }
        };
    }

    /**--------------------------------------------
     * 分类facet
     --------------------------------------------*/

    if (query['enable_facet_category_id'] && query['enable_facet_category_id'] === 'true') {
        result.facets['categories'] = {
            'terms': {
                //field: 'category_id',
                "script_field": "_source.category_id+'" + SPLIT + "'+_source.category_name",
                size: 5000
            }
        }
    }

    /**--------------------------------------------
     * 品牌facet
     --------------------------------------------*/
    if (query['enable_facet_brand_id'] && query['enable_facet_brand_id'] === 'true') {
        result.facets['brands'] = {
            'terms': {
                "script_field": "_source.brand_id+'" + SPLIT + "'+_source.brand_name",
                size: 5000
            }
        }
    }

    return result;
}

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.json({status: false, message: 'not support get,only support post'});
    });

    router.post('/', function (req, res) {

        var query = queryParser(req.body || req.query);

        client.search({
            index: 'product',
            type: 'products',
            body: query
        }, function (err, result) {

            if (err) {
                res.json({status: false, message: err.message});
                return;
            }

            /**--------------------------------------------
             * 商品总数
             --------------------------------------------*/
            var total = result.hits.total;

            /**--------------------------------------------
             * 商品列表
             --------------------------------------------*/
            var products = _.map(result.hits.hits, function (product) {
                return product._source;
            });

            /**--------------------------------------------
             * 处理facet, 分类和品牌数据
             * {
             --------------------------------------------*/
            var facetTermProcess = function (facetKey, terms) {
                var filterItems = _.map(terms, function (term) {
                    var parts = term.term.split(SPLIT);
                    return {
                        id: parts[0],
                        name: parts[1],
                        count: term.count
                    };
                });

                return {
                    _type: facetKey,
                    items: filterItems
                }
            };

            var facetRangeProcess = function (facetKey, ranges) {
                var rangeItems = _.map(ranges, function (range) {
                    return {
                        from: range.from,
                        to: range.to,
                        min: range.min,
                        max: range.max,
                        count: range.count
                    };
                });

                return {_type: facetKey, items: rangeItems};
            };
            var facetKeys = _.keys(result.facets);
            var filters = _.map(facetKeys, function (facetKey) {

                var facetItem = result.facets[facetKey] || {};

                // process terms type
                if (facetItem._type === 'terms') {
                    var terms = result.facets[facetKey].terms;
                    return facetTermProcess(facetKey, terms);
                }

                //process range type for price range
                if (facetItem._type === 'range') {
                    var terms = result.facets[facetKey].ranges;
                    return facetRangeProcess(facetKey, terms);
                }

                return undefined;
            }) || [];


            var result = { status: true, data: { total: total, data: products}};

            /**
             * 对返回结果进行赋值
             *
             * fields:categories,brands,price_ranges
             */
            _.forEach(filters, function (filter) {
                result.data[filter._type] = filter.items;
            });

            res.json(result);
        });

    });
};

    // 统计分类信息
    router.post("/stat_cat", function (req, res) {

        var query = queryParser(req.body || req.query);
        //统计所有分类
        query.aggs = {
            "all_categorys": {
                "terms": {
                    "field": "category_id",
                    "size": 100000
                }
            }
        };

        query.size = 0;
        //搜索
        client.search({
            index: 'product',
            type: 'products',
            body: query
        }, function (err, result) {
            if (err) {
                res.json({status: false, message: err.message});
                return;
            }

            // 获取分组的分类信息
            var groupCategorys = result.aggregations.all_categorys;
            var catTotal = groupCategorys.buckets.length;
            var items = groupCategorys.buckets;

            var result = {
                status: true,
                data: {
                    pro_total: result.hits.total,
                    cat_total: catTotal,
                    data: items
                }
            };

            res.json(result);
            return;
        });
    });

    // 统计品牌
    router.post("/stat_brand",function(req,res){
        var query = queryParser(req.body || req.query);
        //统计所有分类
        query.aggs = {
            "all_brands": {
                "terms": {
                    "field": "brand_id",
                    "size": 100000
                }
            }
        };

        query.size = 0;
        //搜索
        client.search({
            index: 'product',
            type: 'products',
            body: query
        }, function (err, result) {
            if (err) {
                res.json({status: false, message: err.message});
                return;
            }

            // 获取分组的分类信息
            var groupBrands = result.aggregations.all_brands;
            var catTotal = groupBrands.buckets.length;
            var items = groupBrands.buckets;

            var result = {
                status: true,
                data: {
                    pro_total: result.hits.total,
                    cat_total: catTotal,
                    data: items
                }
            };

            res.json(result);
            return;
        })
    })

};