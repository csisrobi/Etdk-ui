import classNames from "classnames";
import { useWatch, Controller, Control } from "react-hook-form";
import { SectionsSanity } from "types";

export const ContributionField = ({
  index,
  sections,
  control,
}: {
  index: number;
  sections: SectionsSanity[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
}) => {
  const selectedSection = useWatch({
    control: control,
    name: `projects.${index}.section`,
  });
  const findSection = sections.find((s) => s._id === selectedSection);
  if (findSection && findSection.contributionNeeded === true) {
    return (
      <Controller
        name={`projects.${index}.contribution`}
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <label>
              <div
                className={classNames(
                  "block h-11 w-full rounded-xl border-none pl-3 text-lg font-semibold placeholder:opacity-80 focus:border-darkcherry focus:ring-darkcherry",
                  "flex cursor-pointer items-center  bg-application3 pl-4 text-darkcherry"
                )}
              >
                <div className="overflow-hidden truncate opacity-80">
                  {value && typeof value === "object"
                    ? value.name
                    : typeof value === "string"
                    ? value
                    : "Hozzájárulási nyilatkozat"}
                </div>
              </div>
              <input
                type="file"
                autoComplete="off"
                className="hidden"
                onChange={(e) =>
                  onChange(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
          );
        }}
      />
    );
  }
  return null;
};