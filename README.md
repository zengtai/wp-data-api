# 从 WordPress Rest API 获取数据

参数：

- url: https://panlasangpinoy.com/
- path: /wp-json/wp/v2/
- type:
  - posts
    - params:
      - per_page
      - page
      - \_fields
        - id
        - date_gmt
        - modified_gmt
        - slug
        - title
        - content
        - excerpt
        - categories
        - yoast_head_json.og_image
  - categories
    - params:
      - per_page
      - page
      - \_fields
        - id
        - name
        - slug
        - count
        - parent

1. 获取数据，保存到本地
   1. 获取响应头 `x-wp-total` 得到总数据条数 `total`
   2. 结合 `per_page` 和 `total`，获得页数 `pages`，进行循环
   3. 保存数据到 `data/{type}.json`
2. 格式化本地数据
   1. 处理内容数据
      1. 筛除、重命名数据条目
      2. 提取图片地址，区分内外链，按原路径下载到本地的对应路径
   2. 基于内容数据处理分类数据
      1. 确定从属关系
      2. 基于从属关系建立导航
3. 根据需求生成必要数据
4. 写入 CMS
