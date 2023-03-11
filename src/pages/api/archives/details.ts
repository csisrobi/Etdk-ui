import { queryArhivDetails } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const resp = await getClient().fetch(queryArhivDetails(req.body.year));
        res.send({ status: 200, body: resp });
      } catch (e) {
        res.send({ status: 500, message: e });
      }
  }
}
