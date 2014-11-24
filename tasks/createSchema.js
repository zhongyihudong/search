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
            "settings": {
                "analysis": {
                    "analyzer": {
                        "ik": {
                            "tokenizer": "ik"
                        }
                    }
                }
            },
            "properties": {
                "id": {
                    type: "string",
                    "store": "yes",
                    "copy_to": "q"
                },
                "product_name": {
                    type: "string",
                    "store": "yes",
                    "copy_to": "q"
                },
                "category_name": {
                    type: "string",
                    "index": "not_analyzed",
                    "store": "yes",
                    "copy_to": "q"
                },
                "brand_name": {
                    type: "string",
                    "index": "not_analyzed",
                    "store": "yes",
                    "copy_to": "q"
                },
                "suppiler_name": {
                    type: "string",
                    "index": "not_analyzed",
                    "store": "yes",
                    "copy_to": "q"
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