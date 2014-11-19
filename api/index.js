/**
 * default index
 * Created by liangyali on 14-11-19.
 */

module.exports = function (router) {

    router.get('/', function (req, res) {
        res.json({name: 'product search api', version: '1.0', status: 'ok'});
    });
};