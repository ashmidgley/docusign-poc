import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  switch (req.method) {
    case "POST":
      try {
        const token = req.body["token"];

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "https://account-d.docusign.com/oauth/userinfo",
          config
        );

        res.status(200).json({ userInfo: response.data });
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
