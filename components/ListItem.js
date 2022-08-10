import Link from "next/link";
import Image from "./Image";
import Banner from "./Banner";
import { IMAGE_BASE } from "../lib/constants";

export default function ListItem({ item, SLOT_ID, tag }) {
  let imgUrl = `${IMAGE_BASE}${item.cover_url}`.replace(
    /(\.jpg)/g,
    `-360x361$1`
  );
  return (
    <>
      <article
        className="article mx-4 flex flex-col justify-between border bg-white p-4 shadow-lg"
        key={item.title}
      >
        <div>
          <Link href={`/recipe/${item.slug}`}>
            <a
              // title={ post.title }
              title={item.title}
            >
              <Image
                src={imgUrl}
                alt={item.title}
                width={400}
                height={400}
                layout={`responsive`}
                lazy
              />
            </a>
          </Link>
          <h3 className="my-4 text-lg font-medium text-slate-700 no-underline">
            <Link href={`/recipe/${item.slug}`}>
              <a title={item.title}>
                <span dangerouslySetInnerHTML={{ __html: item.title }} />
              </a>
            </Link>
          </h3>
          <div className="mb-2 flex flex-wrap gap-2">
            {item.categories.map((item, index) => (
              <span
                key={`${item}${index}`}
                className="bg-slate-200 px-1 py-0.5 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="my-3 flex items-end justify-end">
          <div className="text-right text-slate-700">
            <Link href={`/recipe/${item.slug}`}>
              <a
                className="read-more block whitespace-nowrap"
                title={item.title}
              >
                Read More
              </a>
            </Link>
          </div>
        </div>
      </article>
      {SLOT_ID ? <Banner slot={SLOT_ID} auto tag={tag} /> : null}
    </>
  );
}
