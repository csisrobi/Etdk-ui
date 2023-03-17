import { getClient } from "@lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const form = new formidable.IncomingForm();
        form.parse(
          req,
          async function (
            _err: unknown,
            fields: formidable.Fields,
            files: formidable.Files
          ) {
            if (files.file) {
              const data = fs.readFileSync(
                (files.file as formidable.File).filepath
              );
              if (fields.name) {
                const imageData = await getClient().assets.upload(
                  "file",
                  data,
                  {
                    filename: (fields as { name: string }).name,
                  }
                );
                res.send({ status: 200, body: imageData._id });
              } else {
                throw Error("No fields found");
              }
            } else {
              throw Error("No files found");
            }
          }
        );
      } catch (e) {
        res.send({ status: 500, message: e });
      }
  }
}
