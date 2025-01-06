import React from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import { Flex, Spinner, Text, Wrap, WrapItem } from '@chakra-ui/react';

import { useAuth } from '@frontend/context/auth/auth-core.tsx';
import {
  NOTARY_CRITERIA,
  NotaryCriteriaResponse,
} from '@frontend/gql/user/queries.ts';

export const CriteriaView = () => {
  const { user } = useAuth();

  const { loading, error, data } = useQuery<NotaryCriteriaResponse>(
    NOTARY_CRITERIA,
    {
      variables: { userId: Number(user?.id) },
    },
  );

  if (error) {
    return null;
  }

  if (!data || !data.notaryCriteria) {
    return (
      <Flex p={5} direction="column" alignItems="center">
        <Text fontWeight="medium" me={4}>
          Notář nemá definovaná žádná kritéria přiřazování případů.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex p={5} direction="column" alignItems="center">
      {loading && (
        <Flex>
          <Spinner size="md" color="goldenYellow.500" />
        </Flex>
      )}
      {data && (
        <Box>
          <Flex mb={4} direction={{ base: 'column', md: 'row' }}>
            <Text fontWeight="semibold" me={4}>
              Místně příslušný soud:
            </Text>
            <Text
              bg="goldenYellow.100"
              color="goldenYellow.800"
              fontWeight="medium"
              px={5}
              borderRadius={5}
            >
              {data.notaryCriteria.court.name}
            </Text>
          </Flex>

          <Flex mb={4} direction={{ base: 'column', md: 'row' }}>
            <Text fontWeight="semibold" me={4}>
              Příjmení zůstavitele:
            </Text>
            {data.notaryCriteria.rules.lastnameLetters ? (
              data.notaryCriteria.lastnameLetters.length > 0 ? (
                <Flex gap={2}>
                  {data.notaryCriteria.lastnameLetters.map((letter, index) => (
                    <Flex mb={2} key={index}>
                      <Text
                        bg="goldenYellow.100"
                        color="goldenYellow.800"
                        fontWeight="medium"
                        px={5}
                        borderRadius={5}
                      >
                        {letter}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Text>Žádné omezení.</Text>
              )
            ) : (
              <Text
                bg="gray.100"
                color="gray.800"
                fontWeight="medium"
                px={5}
                borderRadius={5}
              >
                Neaktivní pravidlo
              </Text>
            )}
          </Flex>

          <Flex mb={4} direction={{ base: 'column', md: 'row' }}>
            <Text fontWeight="semibold" me={4}>
              Datum narození zůstavitele:
            </Text>
            <Flex direction="column" gap={5}>
              {data.notaryCriteria.rules.birthDaysMonths ? (
                data.notaryCriteria.birthDaysMonths.map((entry, index) => (
                  <Box key={index} me={4}>
                    <Flex mb={2}>
                      <Text fontWeight="medium" me={2}>
                        Dny:
                      </Text>
                      {entry.days.length > 0 ? (
                        <Wrap spacing={2}>
                          {entry.days.map((day, idx) => (
                            <WrapItem key={idx}>
                              <Text
                                bg="goldenYellow.100"
                                color="goldenYellow.800"
                                fontWeight="medium"
                                px={4}
                                borderRadius={5}
                              >
                                {day}
                              </Text>
                            </WrapItem>
                          ))}
                        </Wrap>
                      ) : (
                        <Text
                          bg="goldenYellow.100"
                          color="goldenYellow.800"
                          fontWeight="medium"
                          px={4}
                          borderRadius={5}
                        >
                          -
                        </Text>
                      )}
                    </Flex>
                    <Flex>
                      <Text fontWeight="medium" me={2}>
                        Měsíce:
                      </Text>
                      {entry.months.length > 0 ? (
                        <Wrap spacing={2}>
                          {entry.months.map((month, idx) => (
                            <WrapItem key={idx}>
                              <Text
                                bg="goldenYellow.100"
                                color="goldenYellow.800"
                                fontWeight="medium"
                                px={4}
                                borderRadius={5}
                              >
                                {month}
                              </Text>
                            </WrapItem>
                          ))}
                        </Wrap>
                      ) : (
                        <Text
                          bg="goldenYellow.100"
                          color="goldenYellow.800"
                          fontWeight="medium"
                          px={4}
                          borderRadius={5}
                        >
                          -
                        </Text>
                      )}
                    </Flex>
                  </Box>
                ))
              ) : (
                <Text
                  bg="gray.100"
                  color="gray.800"
                  fontWeight="medium"
                  px={5}
                  borderRadius={5}
                >
                  Neaktivní pravidlo
                </Text>
              )}
            </Flex>
          </Flex>

          <Flex mb={4} direction={{ base: 'column', md: 'row' }}>
            <Text fontWeight="semibold" me={4}>
              Datum úmrtí zůstavitele:
            </Text>
            {data.notaryCriteria.rules.deathDaysMonths ? (
              data.notaryCriteria.deathDaysMonths.map((entry, index) => (
                <Box key={index} me={4}>
                  <Flex mb={2}>
                    <Text fontWeight="medium" me={2}>
                      Dny:
                    </Text>
                    {entry.days.length > 0 ? (
                      <Wrap spacing={2}>
                        {entry.days.map((day, idx) => (
                          <WrapItem key={idx}>
                            <Text
                              bg="goldenYellow.100"
                              color="goldenYellow.800"
                              fontWeight="medium"
                              px={4}
                              borderRadius={5}
                            >
                              {day}
                            </Text>
                          </WrapItem>
                        ))}
                      </Wrap>
                    ) : (
                      <Text
                        bg="goldenYellow.100"
                        color="goldenYellow.800"
                        fontWeight="medium"
                        px={4}
                        borderRadius={5}
                      >
                        -
                      </Text>
                    )}
                  </Flex>
                  <Flex>
                    <Text fontWeight="medium" me={2}>
                      Měsíce:
                    </Text>
                    {entry.months.length > 0 ? (
                      <Wrap spacing={2}>
                        {entry.months.map((month, idx) => (
                          <WrapItem key={idx}>
                            <Text
                              bg="goldenYellow.100"
                              color="goldenYellow.800"
                              fontWeight="medium"
                              px={4}
                              borderRadius={5}
                            >
                              {month}
                            </Text>
                          </WrapItem>
                        ))}
                      </Wrap>
                    ) : (
                      <Text
                        bg="goldenYellow.100"
                        color="goldenYellow.800"
                        fontWeight="medium"
                        px={4}
                        borderRadius={5}
                      >
                        -
                      </Text>
                    )}
                  </Flex>
                </Box>
              ))
            ) : (
              <Text
                bg="gray.100"
                color="gray.800"
                fontWeight="medium"
                px={5}
                borderRadius={5}
              >
                Neaktivní pravidlo
              </Text>
            )}
          </Flex>
        </Box>
      )}
    </Flex>
  );
};
