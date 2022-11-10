import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Header = () => {
  const links = [
    {
      title: "Általános tudnivalók",
      href: "#",
    },
    {
      title: "2023",
      href: "#",
    },
    {
      title: "Igazolás kérése",
      href: "#",
    },
    {
      title: "Hírek",
      href: "#",
    },
    {
      title: "Archívum",
      href: "#",
    },
    {
      title: "Támogatók",
      href: "#",
    },
    {
      title: "Kapcsolat",
      href: "#",
    },
  ];

  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="flex w-full items-center justify-end  bg-gray p-6">
            <div className="flex items-center lg:hidden">
              <Disclosure.Button className="hover:bg-gray-700 inline-flex items-center justify-center rounded-md p-2 text-white hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                {open ? (
                  <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div className="hidden w-full justify-end lg:flex">
              <div className="space-x-3 xl:space-x-6">
                {links.map((link, index) => (
                  <Link
                    className="text-center text-2xl tracking-wide text-white"
                    key={index}
                    href={link.href}
                  >
                    {link.title.toUpperCase()}
                  </Link>
                ))}
                <button
                  type="button"
                  className="w-48 rounded-3xl bg-white py-2 px-1 text-center text-3xl tracking-wide  text-turquoise xl:w-52"
                >
                  JELENTKEZÉS
                </button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 bg-gray">
              {links.map((link, index) => (
                <Disclosure.Button
                  key={index}
                  as="a"
                  href={link.href}
                  className={
                    "block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-turquoise hover:text-black"
                  }
                >
                  {link.title}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
