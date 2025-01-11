import { useMutation } from '@apollo/client';
import { Divider, OrderedList } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Card,
  Container,
  Flex,
  Heading,
  Image,
  ListItem,
  Stack,
  Text,
} from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';

import { NOTARY_PAYMENT_CALCULATION } from '@frontend/gql/notaryPaymentCalculation/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import {
  FormFields as NotaryPaymentCalculationFormFields,
  NotaryPaymentCalculationForm,
} from '@frontend/pages/notaryPaymentCalculation/NotaryPaymentCalculationForm.tsx';
import { formatPrice } from '@frontend/utils/util.ts';

export const NotaryPaymentCalculationPage = () => {
  const showToast = useCustomToast();

  const [notaryPaymentCalculation, { data, loading }] = useMutation(
    NOTARY_PAYMENT_CALCULATION,
    {
      onError: () => {
        showToast({
          title: 'Výpočet se nezdařil',
          description:
            'Výpočet odměny notáře se nezdařil, zkuste to znovu později.',
          status: 'error',
        });
      },
    },
  );

  const onSubmit: SubmitHandler<NotaryPaymentCalculationFormFields> = async (
    data,
  ) => {
    await notaryPaymentCalculation({
      variables: {
        estateTotalValue: data.estateTotalValue,
      },
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Card
        width="100%"
        minHeight="500px"
        maxW={{
          base: '90%',
          lg: '80%',
        }}
        p="8"
      >
        <Flex direction="column" alignItems="center" m="auto">
          <Image src="/payment.png" w="200px" mb={8} />
          <Heading size="md" textAlign="center">
            Výpočet odměny notáře
          </Heading>
          <Container maxW="container.md">
            <NotaryPaymentCalculationForm
              onSubmit={onSubmit}
              loading={loading}
            />
            {data && (
              <Box p={8} borderWidth="1px" borderRadius="md" boxShadow="sm">
                <Stack spacing={4} direction="column" align="center">
                  <Text fontSize="xl">Celková odměna notáře</Text>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color="goldenYellow.700"
                  >
                    {formatPrice(data?.notaryPaymentCalculation.total)}
                  </Text>

                  <Divider />

                  <Stack
                    spacing={6}
                    direction={{ base: 'column', sm: 'row' }}
                    align="center"
                    textAlign="center"
                    mb={4}
                  >
                    <Box>
                      <Text fontSize="lg" fontWeight="semibold">
                        Odměna notáře
                      </Text>
                      <Text fontSize="xl" color="goldenYellow.500">
                        {formatPrice(data?.notaryPaymentCalculation.fee)}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="lg" fontWeight="semibold">
                        DPH (21%)
                      </Text>
                      <Text fontSize="xl" color="goldenYellow.500">
                        {formatPrice(data?.notaryPaymentCalculation.vat)}
                      </Text>
                    </Box>
                  </Stack>

                  <Alert
                    status="warning"
                    width={{ base: '100%', md: '75%' }}
                    margin="0 auto"
                  >
                    <AlertIcon />
                    Tento výpočet je orientační, konečná částka se může lišit v
                    závislosti na dalších požadovaných či potřebných úkonech.
                  </Alert>
                </Stack>
              </Box>
            )}
            <Accordion my={10} allowToggle>
              <AccordionItem py={1}>
                <AccordionButton>
                  <Heading as="h4" size="sm" textAlign="left" flex="1">
                    Jak určit hodnotu pozůstalosti?
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  Hodnota pozůstalosti je <strong>součet všech aktiv</strong>,
                  tedy plusových hodnot v pozůstalosti. Dluhy z hodnoty{' '}
                  <strong>neodečítejte</strong>. V případě, že je součástí
                  vypořádání dědictví také <strong>vypořádání SJM</strong>,
                  tedy, pokud je součástí řízení pozůstalý manžel/ka, postupujte
                  následovně:
                  <OrderedList mt={2}>
                    <ListItem>Sečtěte majetek v SJM,</ListItem>
                    <ListItem>vydělte částku 2,</ListItem>
                    <ListItem>
                      v případě, že měl zůstavitel nějaký majetek v osobním
                      vlastnictví (tedy majetek, který nespadá do SJM), tak ho k
                      částce přičtěte,
                    </ListItem>
                    <ListItem>
                      výslednou hodnotu zadejte do pole{' '}
                      <em>Hodnota majetku v pozůstalosti</em>.
                    </ListItem>
                  </OrderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Alert status="info" margin="0 auto">
              <AlertIcon />
              Výpočet odměny notáře odpovídá Vyhlášce č. 196/2001 Sb., Notářský
              tarif v platném znění.
            </Alert>
          </Container>
        </Flex>
      </Card>
    </Box>
  );
};
