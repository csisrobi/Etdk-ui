import { Control, useWatch, Controller } from "react-hook-form";
import { FacultySanity } from "types";
import Select from "../FormComponents/Select";

export const SubjectField = ({
  text,
  bg,
  control,
  setAdditional,
  dependencyName,
  fieldName,
  faculties,
}: {
  advisor?: boolean;
  index?: number;
  setAdditional?: (value: string | undefined) => void;
  text: string;
  bg: string;
  dependencyName: string;
  fieldName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  faculties: FacultySanity[];
}) => {
  const selectedFaculty = useWatch({
    control,
    name: dependencyName,
  });
  const facultyData = faculties.find((f) => f._id === selectedFaculty);
  const subjects = facultyData
    ? facultyData.subjects
      ? facultyData.subjects
          .map((sb) => ({ name: sb.name, value: sb._id }))
          .concat([{ name: "Egyéb", value: "additional" }])
      : [{ name: "Egyéb", value: "additional" }]
    : undefined;
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Select
          onChange={(value: string | number) => {
            onChange(value as string);
          }}
          options={subjects}
          value={
            subjects ? subjects.find((s) => s.value === value) || null : null
          }
          placeholder="Szak"
          setAdditional={setAdditional}
          text={text}
          bg={bg}
        />
      )}
    />
  );
};
