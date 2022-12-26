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
        const clickwrapId = req.body["clickwrapId"];

        const dsApiClient = new docusignClick.ApiClient();
        dsApiClient.setBasePath(
          process.env.NEXT_PUBLIC_DOCUSIGN_CLICKAPI_BASE_URL
        );
        dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);

        const userAgreement =
          new docusignClick.UserAgreementRequest.constructFromObject({
            clientUserId: "ashleymidgley@gmail.com",
            documentData: {
              fullName: "Ashley Midgley",
              email: "ashleymidgley@gmail.com",
              company: "Latch",
              title: "Software Engineer",
              date: new Date(),
            },
          });

        const accountApi = new docusignClick.AccountsApi(dsApiClient);
        const result = await accountApi.createHasAgreed(
          accountId,
          clickwrapId,
          {
            userAgreementRequest: userAgreement,
          }
        );

        res.status(200).json(result);
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
