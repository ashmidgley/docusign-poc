import {
  Box,
  Button,
  Flex,
  Heading,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function Home() {
  const [accessToken, setAccessToken] = useState("");
  const [userInfo, setUserInfo] = useState<any>();
  const [templates, setTemplates] = useState<any[]>([]);
  const [agreementUrl, setAgreementUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toggleColorMode } = useColorMode();

  const background = useColorModeValue("gray.100", "gray.700");
  const switchColorScheme = useColorModeValue("green", "red");

  const router = useRouter();

  useEffect(() => {
    if (!accessToken && router.query?.code) {
      setIsLoading(true);
      const body = {
        code: router.query.code as string,
      };

      axios
        .post("/api/docusign/connect", body)
        .then((response) => {
          const token = response.data.accessToken;
          setAccessToken(token);

          axios
            .post("/api/docusign/user-info", {
              token: response.data.accessToken,
            })
            .then((response) => setUserInfo(response.data.userInfo))
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
        })
        .catch((error) => console.error(error));
    }
  }, [router.query, accessToken]);

  const handleOnClick = () => {
    setIsLoading(true);
    const scope = "signature click.manage click.send";
    const url = `https://account-d.docusign.com/oauth/auth?response_type=code&scope=${scope}&client_id=${process.env.NEXT_PUBLIC_DOCUSIGN_INTEGRATION_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_DOCUSIGN_REDIRECT_URI}`;
    router.push(url);
    setIsLoading(false);
  };

  const handleOnListTemplatesClick = () => {
    setIsLoading(true);
    const body = {
      token: accessToken,
      accountId: userInfo.accounts[0].account_id,
    };

    axios
      .post("/api/docusign/templates", body)
      .then((response) => setTemplates(response.data.clickwraps))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const handleOnTemplatesClick = (clickwrapId: string) => {
    setIsLoading(true);
    const body = {
      token: accessToken,
      accountId: userInfo.accounts[0].account_id,
      clickwrapId,
    };

    axios
      .post("/api/docusign/esign", body)
      .then((response) => setAgreementUrl(response.data.agreementUrl))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  const handleOnAgreed = (value: any): void => {
    console.log(value);
  };

  return (
    <main>
      <Box id="ds-clickwrap" />
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <Switch
          onChange={toggleColorMode}
          size="lg"
          colorScheme={switchColorScheme}
          position="absolute"
          top={5}
          right={5}
        />
        <Flex direction="column" background={background} p={12} rounded={6}>
          <Heading mb={3}>DocuSign POC</Heading>
          <Text mb={6}>Click below to begin embedded signing.</Text>
          {!accessToken && (
            <Button
              variant="solid"
              colorScheme="green"
              onClick={handleOnClick}
              mb={3}
              isDisabled={isLoading}
            >
              Connect to DocuSign
            </Button>
          )}
          {accessToken && templates.length === 0 && (
            <Button
              variant="solid"
              colorScheme="red"
              mt={3}
              onClick={handleOnListTemplatesClick}
              isDisabled={isLoading}
            >
              List Templates
            </Button>
          )}
          {templates.length > 0 && (
            <VStack mt={3}>
              {templates.map((template) => (
                <Button
                  variant="link"
                  key={template.clickwrapId}
                  onClick={() => handleOnTemplatesClick(template.clickwrapId)}
                >
                  {template.clickwrapName}
                </Button>
              ))}
            </VStack>
          )}
        </Flex>
      </Flex>
      {agreementUrl && (
        <Script id="embed">
          {window !== undefined &&
            window.docuSignClick.Clickwrap.render(
              {
                agreementUrl: agreementUrl,
                onAgreed: handleOnAgreed,
              },
              "#ds-clickwrap"
            )}
        </Script>
      )}
    </main>
  );
}
