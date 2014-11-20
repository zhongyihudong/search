#!/usr/bin/env node

/**
 * 创建商品索引的Schema
 */

var client = require('../lib/ESClient');
var async = require('async');

var indexName = 'product';

client.index({
    index: indexName,
    type: 'products',
    id: '3',
    body: {
        product_id: 3,
        category_id: 3,
        brand_id: 3,
        published: 3,
        levels:4,
        product_name: '测试数据3'
    }
}, function (error, response) {
    console.log(response);
});