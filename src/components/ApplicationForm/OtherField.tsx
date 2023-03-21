import classNames from "classnames";
import { Control, useWatch, Controller } from "react-hook-form";

export const OtherField = ({
  fieldName,
  dependencyName,
  placeholder,
  text,
  bg,
  control,
}: {
  dependencyName: string;
  fieldName: string;
  placeholder: string;
  index?: number;
  text: string;
  bg: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
}) => {
  const dependencyValue = useWatch({
    control,
    name: dependencyName,
  });
  if (dependencyValue === "additional") {
    return (
      <Controller
        name={fieldName}
        control={control}
        render={({ field: { value, onChange } }) => (
          <input
            onChange={onChange}
            value={value || ""}
            autoComplete="off"
            type="text"
            className={classNames(
              "block h-11 w-full rounded-xl border-none pl-3 text-lg font-semibold placeholder:opacity-80 focus:border-darkcherry focus:ring-darkcherry",
              `${text} ${bg} placeholder:${text}`
            )}
            placeholder={placeholder}
          />
        )}
      />
    );
  }
  return null;
};
