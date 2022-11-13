import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";

const Header = () => {
  const [openMobileDialog, setOpenMobileDialog] = useState(false);
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
    <div className="fixed top-0 z-10 h-[100px] w-full bg-gray">
      <div className="flex w-full items-center p-6">
        <div className="flex-1">
          <Link href="/">
            <Image
              src="/ETDK.png"
              alt={"logo"}
              width={50}
              height={50}
              className="block lg:hidden xl:block"
            />
          </Link>
        </div>
        <div className="flex items-center lg:hidden">
          <button className="hover:bg-gray-700 inline-flex items-center justify-center rounded-md p-2 text-black hover:text-black">
            <Bars3Icon
              className="block h-8 w-8"
              aria-hidden="true"
              onClick={() => setOpenMobileDialog(true)}
            />
          </button>
        </div>
        <div className="hidden justify-end lg:flex">
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
      <Transition.Root show={openMobileDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 "
          onClose={setOpenMobileDialog}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-28">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <div className="no-scrollbar flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-gray-900 text-lg font-medium">
                          <div className="flex w-full items-center">
                            <span className="flex-1">
                              <Image
                                src="/ETDK.png"
                                alt={"logo"}
                                width={40}
                                height={40}
                              />
                            </span>
                            <Transition.Child
                              as={Fragment}
                              enter="ease-in-out duration-500"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="ease-in-out duration-500"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  className="rounded-md text-black"
                                  onClick={() => setOpenMobileDialog(false)}
                                >
                                  <span className="sr-only">Close panel</span>
                                  <XMarkIcon
                                    className="h-8 w-8"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </Transition.Child>
                          </div>
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="">
                          <div className=" flex h-full flex-col content-center space-y-3">
                            {links.map((link, index) => (
                              <Link
                                className="text-center text-2xl tracking-wide text-gray"
                                key={index}
                                href={link.href}
                              >
                                {link.title.toUpperCase()}
                              </Link>
                            ))}
                            <div className="border-t border-gray pt-4 text-center">
                              <button
                                type="button"
                                className="w-48 rounded-3xl bg-gray py-2 px-1 text-center text-3xl tracking-wide  text-turquoise hover:bg-opacity-75 xl:w-52"
                              >
                                JELENTKEZÉS
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Header;
