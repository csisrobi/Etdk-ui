import { fetcher } from "@lib/queries";
import { Button, InputAdornment, TextField } from "@mui/material";
import { isAfter, parseISO } from "date-fns";
import { useState } from "react";
import { Criteria } from "src/pages/admin/pontozas";
import { SanityParticipantScoring } from "types";

export type ScoreType = {
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
  closed,
}: {
  criteria?: Criteria[];
  participant: SanityParticipantScoring;
  closed: boolean;
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
  const scoreParticipant = async () =>
    await fetcher(
      `/participants/score`,
      JSON.stringify({
        id: participant._id,
        scores: scores,
      })
    );
  return (
    <div>
      <table className="border-separate border-spacing-x-3 border-spacing-y-2 ">
        <tbody>
          {(criteria || []).map((c) => (
            <>
              {(isAfter(new Date(), parseISO("2023-05-17T23:59:59")) ||
                c.written) && (
                <tr key={c._id}>
                  <td className="w-full">
                    <p>{c.name}</p>
                  </td>
                  <td>
                    <TextField
                      size="small"
                      value={scores[c._id]?.score || ""}
                      disabled={closed}
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
              )}
            </>
          ))}

          <tr>
            <td>
              {!closed && (
                <Button
                  variant="contained"
                  disabled={Object.keys(errors).length > 0}
                  onClick={scoreParticipant}
                  className="bg-darkcherry"
                >
                  Mentés
                </Button>
              )}
            </td>
            <td className="pl-4">
              {Object.keys(scores).reduce(
                (acc, current) => acc + (scores[current]?.score || 0),
                0
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
