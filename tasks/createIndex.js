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
    id: '5',
    body: {
        product_id: 3,
        product_name: "正品秋冬功能鞋迈凯奇健步鞋男女健走鞋助长鞋减肥瘦身运动鞋摇摇",
        category_name: "女鞋",
        category_id: 4,
        price: 280.01,
        brand_id: 6,
        brand_name: "李宁、360",
        published: 3,
        levels: 4
    }
}, function (error, response) {
    console.log(response);
    client.close();
});