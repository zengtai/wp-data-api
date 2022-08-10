import Layout from "../../components/Layout";
import List from "../../components/List";
import Link from "next/link";
import { getLocalData } from "../../lib/api";

import Head from "next/head";

import { ADS_SLOT_ID, selectedCategories } from "../../lib/constants";
import Banner from "../../components/Banner";

import fs from "fs";
import path from "path";

export default function Category({ data, global }) {
  // console.log(`data`, data);
  let recipes = data.recipes;

  return (
    <>
      <Head>
        <title>{`${data.currentCategory} | Recipe Guru`}</title>
      </Head>
      <Layout items={global.categories}>
        <div className="container mx-auto">
          <Banner slot={ADS_SLOT_ID.category} auto tag={data.currentCategory} />
          <div className="breadcrumb m-4 flex gap-6 whitespace-nowrap text-xs xl:text-sm">
            <div className="breadcrumb-link relative after:absolute after:-right-4 after:opacity-50 after:content-['/']">
              <Link href={`/`}>Home</Link>
            </div>
            <div className="breadcrumb-link opacity-50">
              {data.currentCategory}
            </div>
          </div>
          <h1 className="my-4 text-center text-4xl font-medium text-slate-700">
            {data.currentCategory}
          </h1>
          <div className="grid gap-4 xl:my-8 xl:grid-cols-4 xl:gap-6">
            <List
              items={recipes}
              categories={global.categories}
              SLOT_ID={ADS_SLOT_ID.category}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async (ctx) => {
  // 获取总菜谱数据
  const recipesOriginal = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), `data`, `basicData.json`))
  ).data;
  // 筛选属于所选分类的菜谱
  let recipes = recipesOriginal.filter(
    (recipe) =>
      recipe.categories.filter((cat) => selectedCategories.includes(cat)).length
  );

  recipes.map((recipe) => {
    recipe.categories = recipe.categories.filter((cat) =>
      selectedCategories.includes(cat)
    );
  });

  console.log(`recipes total:`, recipes);
  // 获取总分类数据
  const categories = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), `data`, `categories.json`))
  ).data;
  // 1. 当前分类：通过slug获取
  const currentCategory = categories.find(
    (item) => item.slug == ctx.params.slug
  );

  // 2. 当前分类所属菜谱或文章数据：通过slug获取，slug需要转id
  let recipesOfCurrentCategory = recipes.filter((item) =>
    item.categories.includes(currentCategory.id)
  );
  // 转分类id为分类名
  recipesOfCurrentCategory.map((recipe) => {
    recipe.categories = categories
      .filter((item) => recipe.categories.includes(item.id))
      .map((cat) => cat.name);
  });
  // const posts = await getLocalData(`posts`).then((res) => res.slice(0, 10));

  return {
    props: {
      data: {
        // categories,
        // posts: posts ? posts : `Nothing`,
        recipes: recipesOfCurrentCategory,
        // categoryList,
        currentCategory: currentCategory.name,
      },
    },
  };
};

export const getStaticPaths = async () => {
  // 获取总分类数据
  const categories = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), `data`, `categories.json`))
  ).data;

  let recipeCategories = categories.filter((cat) =>
    selectedCategories.includes(cat.id)
  );
  // console.log(`recipeCategories total:`, recipeCategories.length);
  // 从总分类数据中，基于id筛选菜谱分类并返回slug

  // const slugs = categories.map((res) => res.slug);

  return {
    paths: recipeCategories.map((item) => {
      return {
        params: {
          slug: item.slug,
        },
      };
    }),
    fallback: false,
  };
};
