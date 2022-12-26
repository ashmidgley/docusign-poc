import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  switch (req.method) {
    case "POST":
      try {
        const code = req.body["code"];

        const config = {
          headers: {
            Authorization: `Basic ${btoa(
              `${process.env.NEXT_PUBLIC_DOCUSIGN_INTEGRATION_KEY}:${process.env.NEXT_PUBLIC_DOCUSIGN_SECRET_KEY}`
            )}`,
          },
        };

        const body = {
          grant_type: "authorization_code",
          code: code,
        };

        const response = await axios.post(
          "https://account-d.docusign.com/oauth/token",
          body,
          config
        );

        res.status(200).json({ accessToken: response.data.access_token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
      break;

    default:
      res.status(403).json({ errorMessage: "Forbidden" });
      break;
  }
};

export default handler;
