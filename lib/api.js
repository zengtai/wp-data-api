// 1. 获取响应头 `x-wp-total` 得到总数，获取
// 2. 结合 `per_page` 循环
// 3. 获取数据，保存到本地
// 4. 格式化本地数据
//    1. 处理内容数据
//    2. 基于内容数据处理分类数据
// 5. 根据需求生成必要数据
// 6. 写入 CMS

import fs from "fs";
import path from "path";

export async function getRemoteData(type) {
  // 分类数据
  const per_page = 10;

  let fields = () => {
    switch (type) {
      case "posts":
        return [
          `id`,
          `title`,
          `slug`,
          `content`,
          `excerpt`,
          `categories`,
          `yoast_head_json.og_image`,
          `date_gmt`,
          `modified_gmt`,
        ].join(`,`);
      case "categories":
        return [`id`, `name`, `slug`, `count`, `parent`].join(`,`);
      default:
        break;
    }
  };

  const api_url = `${
    process.env.TARGET_URL
  }/${type}?per_page=${per_page}&_fields=${fields()}`;

  const total = await fetch(api_url).then(async (res) =>
    res.headers.get(`x-wp-total`)
  );

  const pages = Math.ceil(total / per_page);

  const localDataPath = path.join(process.cwd(), `data`, `${type}.json`);

  let originalData = [];

  for (let page = 1; page <= pages; page++) {
    let data = await fetch(api_url.concat(`&page=${page}`)).then((res) =>
      res.json()
    );
    originalData = originalData.concat(data);
    console.log(`完成抓取 ${page}/${pages}`);

    fs.writeFileSync(
      localDataPath,
      JSON.stringify({
        total: originalData.length,
        data: originalData,
      })
    );

    console.log(`完成写入 ${originalData.length}/${total}`);
  }

  return { api_url, originalData };
}

export async function getLocalData(type) {
  const localDataPath = path.join(process.cwd(), `data`, `${type}.json`);
  try {
    if (fs.existsSync(localDataPath)) {
      // return await fetch(localDataPath);
      return JSON.parse(fs.readFileSync(localDataPath)).data;
    } else {
      switch (type) {
        case `posts`:
        case `categories`:
          return await getRemoteData(type);
        default:
          console.log(`The type does not exist`);
          break;
      }
    }
  } catch (e) {
    console.error(e);
  }
}

// 可以在采集过程中执行
export async function formatData() {
  const localDataPath = path.join(process.cwd(), `data`, `posts.json`);

  const basicDataPath = path.join(process.cwd(), `data`, `basicData.json`);
  const fullDataPath = path.join(process.cwd(), `data`, `fullData.json`);
  const contentDataPath = path.join(process.cwd(), `data`, `contentData.json`);
  const coverDataPath = path.join(process.cwd(), `data`, `coverData.json`);

  const originalData = JSON.parse(fs.readFileSync(localDataPath)).data;

  if (!fs.existsSync(basicDataPath) || !fs.existsSync(fullDataPath)) {
    // 列表页使用
    let basicData = [];
    // 详情页使用
    let fullData = [];
    originalData.map((item) => {
      let basicTmp = {
        id: item.id,
        title: item.title.rendered,
        slug: item.slug,
        categories: item.categories,
        cover_url: item.yoast_head_json.og_image[0].url,
      };

      let fullTmp = Object.assign({}, basicTmp);

      fullTmp.content = item.content.rendered;

      basicData.push(basicTmp);
      console.log(`----- 创建基本数据 ${basicData.length} 条`);
      fullData.push(fullTmp);
      console.log(`----- 创建完整数据 ${basicData.length} 条`);
    });

    fs.writeFileSync(
      `${path.join(process.cwd(), `data`, `basicData.json`)}`,
      JSON.stringify({ total: basicData.length, data: basicData })
    );
    console.log(`>>>>> 完成写入基本数据 ${basicData.length} 条`);

    fs.writeFileSync(
      `${path.join(process.cwd(), `data`, `fullData.json`)}`,
      JSON.stringify({ total: fullData.length, data: fullData })
    );
    console.log(`>>>>> 完成写入完整数据 ${fullData.length} 条`);

    // let count = 0;

    // fullData.map((item) => {
    //   item.content = item.content.replace(
    //     /((.|\n)*?)<div id=\\"recipe\\">/g,
    //     `<div id=\"recipe\">`
    //   );
    //   count += 1;
    //   console.log(`改造完成 ${count} 条，共 ${fullData.length} 条`);

    //   fs.writeFileSync(
    //     `${path.join(process.cwd(), `data`, `fullData.json`)}`,
    //     JSON.stringify(fullData)
    //   );

    // });
    return `***** 完成基本数据和完整数据写入`;
  } else if (!fs.existsSync(contentDataPath)) {
    let contentData = [];

    originalData.map((item) => {
      let contentTmp = {
        id: item.id,
        content: item.content.rendered
          .replace(/<figure(.*?)>(.*?)<\/figure>/g, `$2`)
          .replace(/<img(.*?)(class=(.*?)\/>)/g, `<img$1class="body-image" />`)
          .replace(/(<\/?a[^>]*>)(?!.*\1)/gi, ``)
          .replace(/<div class="wprm-spacer"(.*?)<\/div>/g, ``)
          .replace(
            /<div class="wprm-unit-conversion-container(.*?)<\/div>/g,
            ``
          )
          .replace(/style\s*?=\s*?(['"])[\s\S]*?\1/g, ``)
          .replace(
            /<div id="wprm-recipe-video((.|\n|\t)*?)(<h3(.*?)Nutrition)/g,
            `$3`
          )
          .replace(
            /<span class="wprm-recipe-icon wprm-recipe-print-icon((.|\n|\t)*?)(<h2)/g,
            `$3`
          ),
      };
      contentData.push(contentTmp);
      console.log(`----- 创建内容数据 ${contentData.length} 条`);
    });
    fs.writeFileSync(
      contentDataPath,
      JSON.stringify({ total: contentData.length, data: contentData })
    );
    console.log(`>>>>> 写入内容数据 ${contentData.length} 条`);
    return `***** 完成内容数据写入`;
  } else if (!fs.existsSync(coverDataPath)) {
    let coverData = [];
    originalData.map((item) => {
      try {
        let coverTmp = {
          id: item.id,
          cover_url: item.content.rendered.match(
            /<div class="wprm-recipe-image(.*?)src="(.*?)"/
          )[2],
        };
        coverData.push(coverTmp);
        console.log(`----- 创建封面数据 ${coverData.length} 条`);
      } catch (e) {
        console.error(e.messenge);
      }
    });
    fs.writeFileSync(
      coverDataPath,
      JSON.stringify({ total: coverData.length, data: coverData })
    );
    console.log(`>>>>> 写入封面数据 ${coverData.length} 条`);
  }
  return `Done`;
}

function getBodyImagesData(params) {
  const contentDataPath = path.join(process.cwd(), `data`, `contentData.json`);
  const bodyImagesDataPath = path.join(
    process.cwd(),
    `data`,
    `bodyImagesData.json`
  );
  let contentData = JSON.parse(fs.readFileSync(contentDataPath));
  let bodyImagesData = [];
  if (!fs.existsSync(bodyImagesDataPath)) {
    let bodyImages = [];
    contentData.data.map((item) => {
      try {
        let bodyImagesArray = [
          ...item.content.matchAll(/src="((.*?)(jpg|png|jpeg))"/g),
        ];
        bodyImages = bodyImages.concat(
          bodyImagesArray.map((item) => item[1]) || []
        );
        console.log(`----- 读取正文插图数据 ${bodyImages.length} 条`);
      } catch (e) {}
    });
    fs.writeFileSync(
      bodyImagesDataPath,
      JSON.stringify({
        total: bodyImages.length,
        data: bodyImages,
      })
    );
    console.log(`>>>>> 写入正文插图数据 ${bodyImages.length} 条`);
    bodyImagesData = bodyImages;
  } else {
    bodyImagesData = JSON.parse(fs.readFileSync(bodyImagesDataPath));
  }
  return bodyImagesData;
}

export async function getCategoryNameById(id) {
  const categories = await getLocalData(`categories`);
  return categories.filter((cat) => cat.id == id).name;
}
