/**
 * Created by liangyali on 14-11-20.
 */


var _ =require('lodash');

var result ={};
var r = _.reduce([1,2,3],function(result,item,key){
    return result;
});

console.log(r);