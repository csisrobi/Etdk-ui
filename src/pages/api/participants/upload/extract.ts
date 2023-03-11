import { getClient } from "@lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    //TODO: fix file upload
    case "POST":
      try {
        const resp = await getClient().assets.upload(
          "file",
          req.body.project.extract,
          {
            filename: req.body.project.extract.name,
          }
        );
        res.send({ status: 200, body: resp });
      } catch (e) {
        res.send({ status: 500, message: e });
      }
  }
}
