import { sectionParticipants } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { SanityParticipantScoring } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const resp: SanityParticipantScoring[] = await getClient(true).fetch(
          sectionParticipants(req.body.id)
        );
        const session = await getSession({ req });
        if (!session) {
          res.send({ status: 401, message: "Unauthorized" });
        }
        const loggedInUserEmail = session!.user.email;
        const filterUserScores = resp.map((user) => {
          const userScores = user.score;
          const filteredUserScores = userScores?.filter(
            (us) => us.scorer.email === loggedInUserEmail
          );
          return {
            ...user,
            score: filteredUserScores || null,
          };
        });
        res.send({ status: 200, body: filterUserScores });
      } catch (e) {
        console.log(e);
        res.send({ status: 500, message: e });
      }
  }
}
