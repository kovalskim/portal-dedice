import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from '@chakra-ui/react';

export const QuestionsSection = () => {
  return (
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
          <AccordionButton>
            <Heading
              fontSize="lg"
              fontWeight="500"
              textAlign="left"
              flex="1"
              py={2}
            >
              Jak se přihlásím do Portálu dědice?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            Pro přihlášení do Portálu dědice je potřeba nejprve vytvořit účet
            pomocí registračního formuláře. Po ověření e-mailové adresy je možné
            se přihlásit. Později bude dostupné jednotné přihlášení pomocí
            BankID.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton>
            <Heading
              fontSize="lg"
              fontWeight="500"
              textAlign="left"
              flex="1"
              py={2}
            >
              Mohu získat potřebné informace i bez registrace?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            Ano, odpovědi na Vaše otázky týkající se průběhu dědického řízení
            můžete získat i bez registrace / přihlášení do Portálu dědice.
            Interaktivní nachytřovadlo je dostupné všem na jedno kliknutí.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
