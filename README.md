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
        - tags
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

1. 获取响应头 `x-wp-total` 得到总数，获取
2. 结合 `per_page` 循环
3. 获取数据，保存到本地
4. 格式化本地数据
   1. 处理内容数据
   2. 基于内容数据处理分类数据
5. 根据需求生成必要数据
6. 写入 CMS
