import { Box } from "@chakra-ui/react";
import React, { FC } from "react";

const getContent = (agreementUrl: string): string => `
<div id="ds-terms-of-service"></div>
<script src="https://stage.docusign.net/clickapi/sdk/latest/docusign-click.js"></script>
<script>docuSignClick.Clickwrap.render({
  agreementUrl: ${agreementUrl},
  onAgreed: function() {
    console.log("Agreed!")
  }
}, "#ds-terms-of-service");
</script>
`;

interface ESignProps {
  agreementUrl: string;
}

export const ESign: FC<ESignProps> = ({ agreementUrl }) => {
  return <Box dangerouslySetInnerHTML={{ __html: getContent(agreementUrl) }} />;
};
