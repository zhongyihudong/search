/**
 * product manager api
 * Created by liangyali on 14-11-19.
 */

module.exports = function (router) {

    /**
     * 添加商品
     *
     * PUT /product
     */
    router.put('/', function (req, res) {
        res.json({});
    });

    /**
     * 删除商品
     */
    router.delete('/', function (req, res) {
        res.json({status: true});
    });

    /**
     * 更新商品
     */
    router.post('/', function (req, res) {

    });
};
