/**
 * Created by liangyali on 14-11-23.
 */

var query = {
    q: '测试数据',
    category_id: 10,
    brand_id: 1,
    suppiler_id: 1001,
    publish_status: 2,
    from: 0,
    size: 10,
    price_range: {
        from: 0,
        to: 20
    },
    level: 3,
    facet_price_ranges: [
        {
            from: 0,
            to: 20
        },
        {
            from: 21,
            to: 30
        }
    ],
    enable_facet_category_id: true,
    enable_facet_brand_id: false

};
