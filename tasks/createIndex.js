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
    id: '2',
    body: {
        product_id: 3,
        product_name: "正品秋冬功能鞋迈凯奇健步鞋男女健走鞋助长鞋减肥瘦身运动鞋摇摇",
        category_name: "综训鞋/健身鞋",
        category_id: 3,
        brand_id: 3,
        brand_name: "李宁",
        published: 3,
        levels: 4
    }
}, function (error, response) {
    console.log(response);
});