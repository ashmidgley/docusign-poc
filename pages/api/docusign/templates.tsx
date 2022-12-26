import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const docusignClick = require("docusign-click");

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  switch (req.method) {
    case "POST":
      try {
        const token = req.body["token"];
        const accountId = req.body["accountId"];

        const dsApiClient = new docusignClick.ApiClient();
        dsApiClient.setBasePath(
          process.env.NEXT_PUBLIC_DOCUSIGN_CLICKAPI_BASE_URL
        );
        dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
        const accountApi = new docusignClick.AccountsApi(dsApiClient);

        const response = await accountApi.getClickwraps(accountId);

        res.status(200).json(response);
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
