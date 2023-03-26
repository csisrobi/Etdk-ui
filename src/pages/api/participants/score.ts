import { getClient } from "@lib/sanity";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { mutate } from "swr";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const resp = await getClient()
          .patch(req.body.id, {
            set: {
              score: Object.keys(req.body.scores).map((s) => ({
                score: req.body.scores[s]?.score || 0,
                criteria: { _type: "reference", _ref: s },
                _key: nanoid(),
              })),
            },
          })
          .commit()
          .then(() => {
            mutate("/section_participants");
          });
        res.send({ status: 200, body: resp });
      } catch (e) {
        res.send({ status: 500, message: e });
      }
  }
}
