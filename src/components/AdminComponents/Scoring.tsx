import { getClient } from "@lib/sanity";
import { Button, InputAdornment, TextField } from "@mui/material";
import { nanoid } from "nanoid";
import { useState } from "react";
import { Criteria } from "src/pages/admin/pontozas";
import { mutate } from "swr";
import { SanityParticipant } from "types";

type ScoreType = {
  [key: string]: {
    name: string;
    score: number;
  };
};

type ErrorType = {
  [key: string]: string | undefined;
};

export const ParticipantScoring = ({
  criteria,
  participant,
}: {
  criteria: Criteria[];
  participant: SanityParticipant;
}) => {
  const [scores, setScores] = useState<ScoreType>(
    participant.score
      ? participant.score.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.criteria._id]: { score: cur.score, name: cur.criteria.name },
          }),
          {}
        )
      : {}
  );
  const [errors, setErrors] = useState<ErrorType>({});
  const scoreParticipant = async () => {
    await getClient()
      .patch(participant._id, {
        set: {
          score: Object.keys(scores).map((s) => ({
            score: scores[s]?.score || 0,
            criteria: { _type: "reference", _ref: s },
            _key: nanoid(),
          })),
        },
      })
      .commit()
      .then(() => {
        mutate("/section_participants");
      })
      .catch((e) => console.error(e));
  };

  return (
    <div>
      <table className="border-separate border-spacing-x-3 border-spacing-y-2 ">
        <tbody>
          {criteria.map((c) => (
            <tr key={c._id}>
              <td className="w-full">
                <p>{c.name}</p>
              </td>
              <td>
                <TextField
                  size="small"
                  value={scores[c._id]?.score || 0}
                  type="number"
                  onChange={(e) => {
                    if (parseInt(e.target.value) > c.maxScore) {
                      setErrors({
                        ...errors,
                        [c._id]: `A maximum pontszám ${c.maxScore}`,
                      });
                    } else {
                      const errorsHolder = errors;
                      delete errorsHolder[c._id];
                      setErrors(errorsHolder);
                    }
                    setScores({
                      ...scores,
                      [c._id]: {
                        name: c.name,
                        score: parseInt(e.target.value) || 0,
                      },
                    });
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        /{c.maxScore}
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors[c._id]}
                  helperText={errors[c._id]}
                  className="w-32"
                />
              </td>
            </tr>
          ))}
          <td>
            <Button
              variant="contained"
              disabled={Object.keys(errors).length > 0}
              onClick={scoreParticipant}
              className="bg-darkcherry"
            >
              Mentés
            </Button>
          </td>
          <td className="pl-4">
            {Object.keys(scores).reduce(
              (acc, current) => acc + (scores[current]?.score || 0),
              0
            )}
          </td>
        </tbody>
      </table>
    </div>
  );
};
