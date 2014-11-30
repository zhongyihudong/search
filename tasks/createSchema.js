#!/usr/bin/env node

/**
 * 创建商品索引的Schema
 */

var client = require('../lib/ESClient');
var async = require('async');

var indexName = 'product';

async.series([function (callback) {
    //创建索引
    console.log('creeate index');
    client.indices.create({index: indexName}, callback);
}, function (callback) {
    console.log('put mapping');
    client.indices.putMapping({
        index: indexName,
        type: 'products',
        allowNoIndices: true,
        body: {
            "products": {
                "_all": {
                    "indexAnalyzer": "ik",
                    "searchAnalyzer": "ik",
                    "term_vector": "no",
                    "store": "false"
                }},
            "properties": {
                "id": {
                    type: "string",
                    "store": "yes"
                },
                "product_name": {
                    type: "string",
                    "store": "yes"
                },
                "category_name": {
                    type: "string",
                    "index": "not_analyzed",
                    "store": "yes"
                },
                "brand_name": {
                    type: "string",
                    "index": "not_analyzed",
                    "store": "yes"
                },
                "suppiler_name": {
                    type: "string",
                    "index": "not_analyzed",
                    "store": "yes"
                },
                "q": {
                    "type": "string",
                    "indexAnalyzer": "ik",
                    "searchAnalyzer": "ik"
                }
            }
        }
    }, callback);
}], function (err, results) {
    if (err) {
        console.error(err);
        client.close();
        return;
    }

    console.log(results);

    client.close();
});