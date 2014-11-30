#!/usr/bin/env node
/**
 * Created by liangyali on 14-11-24.
 */
var request = require('request');

request({
    method: 'DELETE',
    url: 'http://127.0.0.1/products/2'
}, function (error, response, body) {
    console.log(error);
    console.log(body);
});

request({
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    url: 'http://127.0.0.1/products',
    body: JSON.stringify({id: 10})
}, function (error, response, body) {
    console.log(error);
    console.log(body);
});

request({
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    url: 'http://s.liangyali.com/products/search',
    body: JSON.stringify({category_id: 40})
}, function (error, response, body) {
    console.log(error);
    console.log(body);
});
