import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Fragment } from "react";
import type { SelectOption } from "types";

export default function Select({
  options,
  onChange,
  value,
  disabled,
  placeholder,
}: {
  options: SelectOption[] | undefined;
  onChange: (value: string) => void;
  value: SelectOption | null;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <Listbox
      value={value}
      onChange={(e) => {
        if (e) {
          onChange(e.value);
        }
      }}
      disabled={disabled}
    >
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="relative h-11 w-full cursor-default rounded-xl border border-[#6b7280] bg-white py-2 pl-3 pr-10 text-left text-lg shadow-sm focus:border-darkcherry focus:outline-none focus:ring-1 focus:ring-darkcherry sm:text-sm">
              <div className="flex items-center">
                <div className="sm:text-md ml-1 block truncate text-lg tracking-tight">
                  {value ? (
                    value.name
                  ) : placeholder ? (
                    <div className="text-[#6b7280]">{placeholder}</div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {!disabled && (
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronDownIcon
                    className="text-gray-400 h-5 w-5"
                    aria-hidden="true"
                  />
                </span>
              )}
            </Listbox.Button>
            {options && (
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-darkcherry text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <div
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "sm:text-md ml-1 block truncate text-lg tracking-tight"
                              )}
                            >
                              {option.name}
                            </div>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-darkcherry",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            )}
          </div>
        </>
      )}
    </Listbox>
  );
}
