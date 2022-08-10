import Layout from "../../components/Layout";

import fs from "fs";
import path from "path";

import Link from "next/link";
import { getLocalData, removeLink } from "../../lib/api";

import Banner from "../../components/Banner";

import { ADS_SLOT_ID, selectedCategories } from "../../lib/constants";
import Head from "next/head";

export default function Recipe({ data, global }) {
  // console.log(`recipe`, data.recipe);
  // console.log(`categoryList`, data.categoryList);
  // console.log(`imageUrls`, data.imageUrls);
  // console.log(`categories`, data.categories);

  let recipe = data.recipe;
  console.log(`recipe`, recipe);
  let noLink = false;

  return (
    <>
      <Head>
        <title>{`${recipe.title} | Recipe Guru`}</title>
      </Head>
      <Layout items={global.categories}>
        {/* <div className="container mx-auto">
          <Banner slot={ADS_SLOT_ID.detail} auto tag={recipe.title} />
          <div className="breadcrumb m-4 flex gap-6 whitespace-nowrap text-xs xl:text-sm">
            <div className="breadcrumb-link relative after:absolute after:-right-4 after:opacity-50 after:content-['/']">
              <Link href={`/`}>Home</Link>
            </div>
            <div className="breadcrumb-link relative after:absolute after:-right-4 after:opacity-50 after:content-['/']">
              {recipe.categories.map((cat) => (
                <Link key={cat} href={`/category/${cat}`}>
                  <a>{cat}</a>
                </Link>
              ))}
            </div>
            <div className="breadcrumb-link opacity-50">{recipe.title}</div>
          </div>
          <article
            className="article content"
            dangerouslySetInnerHTML={{ __html: recipe.content }}
          ></article>
        </div> */}
      </Layout>
    </>
  );
}

export const getStaticProps = async (ctx) => {
  const categories = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), `data`, `categories.json`))
  ).data;

  const recipesOriginal = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), `data`, `basicData.json`))
  ).data;

  let finalrecipe = recipesOriginal.filter(
    (recipe) => recipe.slug == ctx.params.slug
  )[0];

  let currentCategories = finalrecipe.categories.filter((item) =>
    selectedCategories.includes(item.id)
  );

  // let currentCategories = categories.filter((item) =>
  //   finalrecipe.categories.includes(item.id)
  // );

  finalrecipe.categories = currentCategories.slice();

  // let categoryList = categories.map((cat) => recipe.category == cat.name);

  return {
    props: {
      data: {
        // categories,
        // posts: posts ? posts : `Nothing`,
        recipe: finalrecipe,
        currentCategories: typeof finalrecipe.categories,
        // categoryList,
      },
    },
  };
};

export const getStaticPaths = async (ctx) => {
  const slugs = await getLocalData(`posts`).then((res) =>
    res.map((recipe) => recipe.slug)
  );

  return {
    paths: slugs.map((slug) => ({
      params: {
        slug: slug,
      },
    })),
    fallback: false,
  };
};
