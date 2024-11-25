import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';

import { FeatureCard } from '@frontend/pages/home/components/FeatureCard.tsx';
import { Routes } from '@frontend/routes/routes.ts';

export const FeaturesSection = () => {
  return (
    <Box as="section" py={12} px={6}>
      <Heading fontSize="3xl" color="gray.800" mb={12} letterSpacing="-1px">
        Služby a funkce Portálu dědice
      </Heading>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
        <Flex direction="column" gap={8}>
          <FeatureCard
            heading="Dědické nachytřovadlo"
            linkLabel="Spustit nachytřovadlo"
            linkTo={Routes.educator}
          >
            <Text>
              Jste pozůstalý a nevíte si rady s průběhem dědického řízení?
              Hledáte odpovědi na veškeré Vaše otázky týkající se dědického
              řízení, které Vás v blízké době čeká?
            </Text>
          </FeatureCard>
          <FeatureCard
            heading="Přípravka v rámci dědického řízení"
            linkLabel="Připravit se"
            linkTo={Routes.logIn}
          >
            <Text>
              Zjistěte, co vše je třeba a připravte si prostřednictvím Portálu
              dědice potřebné podklady včas pro nadcházející či probíhající
              dědické řízení.
            </Text>
          </FeatureCard>
        </Flex>
        <FeatureCard
          heading="Průvodce dědickým řízením"
          linkLabel="Přejít do Portálu dědice"
          linkTo={Routes.logIn}
        >
          <Text mb={8}>
            Portál dědice slouží jako váš digitální průvodce dědickým řízením.
            Informuje Vás o aktuálním průběhu dědického řízení, úkolech či
            souborech, které od Vás notář vyžaduje apod.
          </Text>
          <Flex justifyContent="center">
            <Image
              src="/features.png"
              alt="Průvodce dědickým řízením"
              borderRadius="10px"
              w="400px"
            />
          </Flex>
        </FeatureCard>
      </Flex>
    </Box>
  );
};
