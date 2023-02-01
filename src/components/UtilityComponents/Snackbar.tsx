import { Transition } from "@headlessui/react";
import { Fragment } from "react";

const Snackbar = ({ message, open }: { message: string; open: boolean }) => {
  return (
    <Transition
      show={open}
      as={Fragment}
      enter="transition ease-in-out duration-400"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in-out duration-400"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="justify center absolute bottom-10 left-10 flex min-w-[200px] rounded-lg bg-red-200 px-4 py-3 ">
        <p className="text-lg font-black text-red-800">{message}</p>
      </div>
    </Transition>
  );
};

export default Snackbar;
