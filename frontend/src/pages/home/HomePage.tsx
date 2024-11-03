import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';

import { RouterNavButton } from '@frontend/components/navigation/atoms/RouterNavButton.tsx';
import { useAuth } from '@frontend/context/auth';
import { FeatureCard } from '@frontend/pages/home/components/FeatureCard.tsx';
import { Routes } from '@frontend/routes.ts';

export const HomePage = () => {
  const { user } = useAuth();

  const heroSection = (
    <Box as="section" py={12} px={6}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 12, md: 0 }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex
          direction="column"
          align="start"
          maxW={{ base: '100%', md: '50%' }}
        >
          <Heading fontSize="4xl" color="gray.800" mb={12} letterSpacing="-1px">
            Portál dědice
          </Heading>
          <Text fontSize="xl" mb={14}>
            Potřebujete poradit či provést dědickým řízením? Portál dědice Vám
            poskytne vše, co potřebujete vědět a celým dědickým řízením Vás
            provede.
          </Text>
          {!user ? (
            <RouterNavButton size="lg" to={Routes.logIn}>
              Přihlásit se do Portálu dědice
            </RouterNavButton>
          ) : (
            <RouterNavButton
              size="lg"
              to={Routes.proceedings}
              minW={{ md: '280px' }}
            >
              Přejít do Portálu dědice
            </RouterNavButton>
          )}
        </Flex>
        <Flex
          maxW={{ base: '100%', md: '50%' }}
          justifyContent={{ base: 'center', md: 'end' }}
        >
          <Image src="/hero.png" alt="" w="90%" borderRadius="10px" />
        </Flex>
      </Flex>
    </Box>
  );

  const featuresSection = (
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
            ></Image>
          </Flex>
        </FeatureCard>
      </Flex>
    </Box>
  );

  const questionsSection = (
    <Box as="section" py={12} px={6}>
      <Heading
        fontSize="3xl"
        color="gray.800"
        mb={12}
        letterSpacing="-1px"
        textAlign="center"
      >
        Často se ptáte
      </Heading>
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontWeight="medium"
                fontSize="lg"
                py={2}
              >
                Jak se přihlásím do Portálu dědice?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Pro přihlášení do Portálu dědice je potřeba nejprve vytvořit účet
            pomocí registračního formuláře. Po ověření e-mailové adresy je možné
            se přihlásit. Později bude dostupné jednotné přihlášení pomocí
            BankID.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontWeight="medium"
                fontSize="lg"
                py={2}
              >
                Mohu získat potřebné informace i bez registrace?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Ano, odpovědi na Vaše otázky týkající se průběhu dědického řízení
            můžete získat i bez registrace / přihlášení do Portálu dědice.
            Interaktivní nachytřovadlo je dostupné všem na jedno kliknutí.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );

  return (
    <>
      {heroSection}
      {featuresSection}
      {questionsSection}
    </>
  );
};
