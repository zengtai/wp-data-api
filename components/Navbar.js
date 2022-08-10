import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { useRouter } from "next/router";

import { CloseIcon, MenuIcon } from "./Icons";

import { selectedCategories } from "../lib/constants";

export default function Navbar({ items }) {
  // console.log(`nav items`, items);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggle() {
    setIsMenuOpen(!isMenuOpen);
  }

  let navItem = items.filter((cat) => selectedCategories.includes(cat.id));

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white/90 shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between text-sm font-medium uppercase text-slate-700 xl:flex-nowrap xl:gap-10">
        <Link href={`/`}>
          <a className="mx-4 my-2 h-10 w-20 xl:mx-0" title="Home">
            <Image
              src={`${useRouter().basePath}/brand/logo.png`}
              height={50}
              width={114}
              layout={`responsive`}
              alt={`Logo`}
            />
          </a>
        </Link>
        <button onClick={toggle} className="navbar-toggler p-4 xl:hidden">
          {isMenuOpen ? CloseIcon(`icon-close`) : MenuIcon(`icon-menu`)}
        </button>
        <ul
          className={`${
            isMenuOpen ? `flex w-full` : `hidden`
          } flex-col divide-y xl:flex xl:flex-row xl:items-center xl:gap-4 xl:divide-y-0`}
        >
          <li className="current mx-4 py-2">
            <Link href={`/`}>
              <a className="py-6 hover:text-orange-600">Home</a>
            </Link>
          </li>
          {
            navItem &&
              navItem.map((item) => (
                <li className="mx-4 whitespace-nowrap py-2" key={item.id}>
                  <Link href={`/category/${item.slug}`} prefetch={false}>
                    <a className="hover:text-orange-600">
                      {item.name.replace(/\s(r|R)ecipes/g, ``)}
                    </a>
                  </Link>
                </li>
              ))
            // console.log(`children`, children, `type: `, typeof children);
          }
        </ul>
      </div>
    </nav>
  );
}
