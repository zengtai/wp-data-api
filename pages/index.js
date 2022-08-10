import { getLocalData } from "../lib/api";
import Banner from "../components/Banner";
import List from "../components/List";

import fs from "fs";
import path from "path";

import Link from "next/link";

import { ADS_SLOT_ID, selectedCategories } from "../lib/constants";

import Layout from "../components/Layout";
import Head from "next/head";

// import { getCategoryNameById } from "../lib/api";

export default function Home({ data, global }) {
  let recipes = data.recipes;

  // let activeCategories = global.categories.filter((item) =>
  //   fullNavItems[0]?.["Resep"].includes(item.name)
  // );
  console.log(`recipes total`, recipes.length);

  return (
    <>
      <Head>
        <title>Recipe Guru</title>
      </Head>
      <Layout items={global.categories}>
        <div className="container mx-auto">
          <Banner
            className={`mt-4`}
            style={{ display: "flex", justifyContent: "center" }}
            slot={ADS_SLOT_ID.home}
            responsive="true"
            auto
            tag={`home`}
          />
          <header className="m-4 text-center">
            <h6 className="text-sm font-medium text-orange-600">
              <span>+1000 EASY RECIPES</span>
            </h6>
            <h2 className="my-2 text-4xl font-medium text-slate-700">
              Latest recipes
            </h2>
            <h5 className="my-2 text-slate-400">
              Food trends, easy recipes and healthy meal ideas to help you cook
              smarter.
            </h5>
          </header>
          <div className="grid gap-4 xl:my-8 xl:grid-cols-4 xl:gap-6">
            <List items={recipes} type={`recipes`} SLOT_ID={ADS_SLOT_ID.home} />
          </div>
          <div>
            <ul className="m-4 flex flex-wrap gap-2">
              {global.categories.map((item) => (
                <li key={item.id}>
                  <Link href={`/category/${item.slug}`}>
                    <a className="inline-block border p-2">{item.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async (ctx) => {
  // const categories = await getLocalData(`categories`);

  let recipes = [];

  // const posts = await getLocalData(`posts`).then((res) => res.slice(0, 10));

  const categories = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), `data`, `categories.json`))
  ).data;

  const recipesOriginal = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), `data`, `basicData.json`))
  ).data;

  let finalrecipes = recipesOriginal.filter(
    (recipe) =>
      recipe.categories.filter((cat) => selectedCategories.includes(cat)).length
  );

  finalrecipes.map((recipe) => {
    recipe.categories = recipe.categories.filter((cat) =>
      selectedCategories.includes(cat)
    );
  });

  finalrecipes.map((recipe) => {
    recipe.categories = categories
      .filter((item) => recipe.categories.includes(item.id))
      .map((cat) => cat.name);
  });

  // finalrecipes.slice(0, 18).map((recipe) => {
  //   let tmp = {
  //     title: recipe.title,
  //     slug: recipe.slug,
  //     categories: categories
  //       .filter((item) => recipe.categories.includes(item.id))
  //       .map((cat) => cat.name),
  //     cover_url: recipe.cover_url,
  //   };
  //   recipes.push(tmp);
  // });

  return {
    props: {
      data: {
        // categories,
        // posts: posts ? posts : `Nothing`,

        recipes: finalrecipes.slice(0, 18),
      },
    },
  };
};
