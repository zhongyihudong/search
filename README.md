#商品接口说明V1.0

***

#### 实现搜索功能点

编号 | 说明 | 状态
------------ | ------------- | ------------
1 | 关键词的查询   | 完成
2 | 分类id的查询 | 完成
3 | 品牌id的查询 |完成
4 |  供应商id的查询 | 完成
5 | 发布状态的查询 |完成
6 |  价格区间的查询 | 完成
7 | 商品级别的查询 | 完成
8 | 价格区间的聚合 | 完成
9 | 分类的聚合 |完成
10 | 品牌的聚合 | 完成
11 | 自定义排序 | 完成


### 商品搜索接口
***

##### POST /products/search


说明：根据查询条件获取商品，和聚合后的价格区间，品牌，分类

##### 请求参数

``` js
{
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
    enable_facet_category: true,
    enable_facet_brand: false,
    sort:[{"price":"asc"}]

}

```

> 以上参数不是请求都需要，比如查询分类id为5的所有要的商品，参数如下：

### 测试接口
``` sh
curl -XPOST http://127.0.0.1/products/search --header 'Content-Type:application/json' -d'
{
	brand_id:5
}
'
```


参数名称 | 说明 | 默认值
------------ | ------------- | ------------
q | 模糊查询词  | 不传递查询所有数据,{}查询所有数据
category_id | 分类id  | 
brand_id | 品牌id
publish_status|商品发布状态
from| 偏移数量|0
size|获取数量|10
price_range|价格区间 {from:100,to:101},from起始价格，可以为空，to结束价格可以为空，如果查询>100的商品 ``` {price_range:{from:100}} ```
level|商品级别，获取传入小于等于级别的商品
facet_price_ranges|价格区间聚合参数，
enable_facet_category|开启分类聚合 | false
enable_facet_brand|开启品牌聚合 |false
sort|排序参数 |[]

####搜索响应参数

``` js
{
    "status": true,
    "message": "",
    "data": {
        "total": 4,
        "data": [],
        "categories": [
            {
                "id": "3",
                "name": "综训鞋/健身鞋",
                "count": 3
            },
            {
                "id": "4",
                "name": "女鞋",
                "count": 1
            }
        ], "brands": [
            {
                "id": "5",
                "name": "李宁",
                "count": 3
            },
            {
                "id": "6",
                "name": "李宁、360",
                "count": 1
            }
        ], "price_ranges": [
            {
                "from": 0,
                "to": 100,
                "max": 90,
                "min": 90,
                "count":1
            }
        ]
    }}
```

参数名称 | 说明 | 默认值
------------ | ------------- | ------------
status | 结果状态 true,or false  
message | 异常信息  |[]
data.total | 商品总数 |0
data.data|商品数据( ```具体数据为添加的商品信息```)|[]
data.categories| 分类聚合信息 ```name:分类名称，id:分类id,count:商品数量```|[]
data.brands|品牌聚合信息```name:品牌名称，id:品牌id,count:商品数量```|[]
data.price_ranges|价格区间聚合信息|[]

***
### 添加或更新商品接口
***
##### PUT /products
##### 请求参数
``` js
{
	id:'s01-90-001' //required
	category_id:1,
	category_name:'test'
	...
}
```
> id字段为必填字段，其他字段可以根据根据业务自己定义，用于查询的接口字段，请使用搜索接口定义字段名称和类型

##### 请求响应

``` js
{
	status:true,
	message:''
}
```



### 删除商品接口
***
##### DELETE /products/:id

##### 请求响应

``` js
{
	status:true,
	message:''
}
```