import {
  CardHeader,
  CheckCircleIcon,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
} from '@chakra-ui/icons';
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useOutletContext } from 'react-router-dom';

import { InfoHintBox } from '@frontend/components';
import { Proceeding } from '@frontend/gql/proceedings/queries.ts';

export type OutletContextType = { proceeding: Proceeding };

export const ProceedingsOverviewPage = () => {
  const { proceeding } = useOutletContext<OutletContextType>();

  if (!proceeding || proceeding.phaseId === undefined) return null;

  return (
    <>
      <Box>
        <Tabs
          width="100%"
          colorScheme="goldenYellow"
          defaultIndex={proceeding?.phaseId ? proceeding.phaseId - 1 : 0}
        >
          <TabList>
            <Flex direction={{ base: 'column', md: 'row' }} width="full">
              <Tab flex={1} isDisabled={proceeding.phaseId !== 1}>
                {proceeding?.phaseId > 1 && (
                  <CheckCircleIcon color="green" mr={4} />
                )}
                <Text>Úvodní fáze</Text>
              </Tab>
              <Tab flex={1} isDisabled={proceeding?.phaseId !== 2}>
                {proceeding?.phaseId > 2 && (
                  <CheckCircleIcon color="green" mr={4} />
                )}
                <Text>Předběžné šetření</Text>
              </Tab>
              <Tab flex={1} isDisabled={proceeding?.phaseId !== 3}>
                {proceeding?.phaseId > 3 && (
                  <CheckCircleIcon color="green" mr={4} />
                )}
                <Text>Pozůstalostní řízení</Text>
              </Tab>
            </Flex>
          </TabList>
          <TabPanels mt={2}>
            <TabPanel px={0}>
              <InfoHintBox title={'Co probíhá v úvodní fázi dědického řízení?'}>
                Úvodní fáze dědického řízení začíná okamžikem odeslání úmrtního
                listu na matriku. V průběhu této fáze je pověřen příslušný notář
                vedením dědického řízení. Notář si na soudu vyzvedává příslušný
                spis a začíná na dědickém řízení pracovat.
              </InfoHintBox>
            </TabPanel>
            <TabPanel>
              <InfoHintBox title={'K čemu slouží předběžné šetření? '}>
                V rámci tzv. Předběžného šetření notář od vypravitele pohřbu
                zjišťuje podrobnosti o pozůstalém, o rodinné anamnéze, majetku
                pozůstalého ale i ostatních účastnících řízení atd. Na základě
                těchto informací a vyžádaných potřebných dokumentech notář
                připraví potřebné podklady pro pozůstalostní řízení.
              </InfoHintBox>
            </TabPanel>
            <TabPanel>
              <InfoHintBox title={'Co znamená fáze pozůstalostního řízení? '}>
                Pozůstalostní řízení je soudním jednáním v prvním stupni. Notář
                vystupuje v pozici soudního komisaře. Cílem tohoto jednání je,
                aby se účastníci řízení dohodli na rozdělení majetku v
                pozůstalosti. Během tohoto jednání jsou přítomni všichni
                dědicové.
              </InfoHintBox>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Box mt={8}>
        <Heading fontSize="lg" mb={4}>
          Nadcházející události
        </Heading>
        <SimpleGrid
          spacing={4}
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        >
          <Card>
            <CardHeader pt={4} pb={2}>
              <Heading size="sm">TODO: Událost</Heading>
            </CardHeader>
            <CardBody pb={4} pt={2}>
              <Text>Popis události.</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
      <Box my={10}>
        <Heading fontSize="lg" mb={4}>
          Úkoly
        </Heading>
        <Box>TODO: úkoly, pokud teda budou :)</Box>
      </Box>
    </>
  );
};
