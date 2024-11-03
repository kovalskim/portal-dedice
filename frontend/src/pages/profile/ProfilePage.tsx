import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { defineStyle, HStack } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Card,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@frontend/context/auth';
import {
  CHANGE_PASSWORD_MUTATION,
  UPDATE_USER_MUTATION,
} from '@frontend/gql/user/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import {
  ChangePasswordForm,
  FormFields as ChangePasswordFormFields,
} from '@frontend/pages/profile/components/ChangePasswordForm.tsx';
import {
  ChangePersonalDataForm,
  FormFields as ChangePersonalDataFormFields,
} from '@frontend/pages/profile/components/ChangePersonalDataForm.tsx';
import { Routes } from '@frontend/routes.ts';

export const ProfilePage = () => {
  const { signIn, user, token } = useAuth();
  const navigate = useNavigate();

  const [accordionIndex, setAccordionIndex] = useState<number | number[]>(-1);

  const showToast = useCustomToast();

  useEffect(() => {
    if (!user) {
      showToast({
        title: 'Nepřihlášený uživatel',
        description: 'Pro zobrazení této stránky se musíte přihlásit.',
        status: 'error',
      });
      navigate(Routes.logIn);
    }
  }, [user, showToast, navigate]);

  const ringCss = defineStyle({
    outlineWidth: '2px',
    outlineColor: 'colorPalette.500',
    outlineOffset: '2px',
    outlineStyle: 'solid',
  });

  const [updateUser, { loading: updateUserLoading, error: updateUserError }] =
    useMutation(UPDATE_USER_MUTATION);

  const [
    changePassword,
    { loading: changePasswordLoading, error: changePasswordError },
  ] = useMutation(CHANGE_PASSWORD_MUTATION);

  const onSubmitChangePersonalData: SubmitHandler<
    ChangePersonalDataFormFields
  > = async (data) => {
    try {
      const userData = await updateUser({
        variables: {
          userId: user?.id,
          beforeTitle: data.beforeTitle,
          firstname: data.firstname,
          lastname: data.lastname,
          afterTitle: data.afterTitle,
        },
      });

      const updatedUser = userData.data.updateUser;
      signIn({ token, user: updatedUser });

      showToast({
        title: 'Osobní údaje změněny',
        description: 'Vaše osobní údaje byly úspěšně změněny.',
        status: 'success',
      });

      setAccordionIndex(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitChangePassword: SubmitHandler<
    ChangePasswordFormFields
  > = async (data) => {
    try {
      await changePassword({
        variables: {
          userId: user?.id,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
      });

      showToast({
        title: 'Heslo změněno',
        description: 'Vaše heslo bylo úspěšně změněno.',
        status: 'success',
      });

      setAccordionIndex(-1);
    } catch (err) {
      console.error(err);
    }
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
        p={8}
      >
        <Heading>Můj profil</Heading>
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Stack gap="8" my={12}>
            <HStack key={user?.email} gap="8">
              <Avatar
                name={`${user?.firstname} ${user?.lastname}`}
                size="xl"
                css={ringCss}
              />
              <Stack gap="0">
                <Text fontWeight="medium" fontSize="2xl">
                  {`${user?.beforeTitle ? user.beforeTitle + ' ' : ''}${user?.firstname} ${user?.lastname}${user?.afterTitle ? ',' : ''} ${user?.afterTitle || ''}`}
                </Text>
                <Text color="fg.muted" fontSize={'lg'}>
                  {user?.email}
                </Text>
              </Stack>
            </HStack>
          </Stack>
        </Flex>

        <Accordion
          allowToggle
          index={accordionIndex}
          onChange={(index) => setAccordionIndex(index)}
        >
          <AccordionItem>
            <AccordionButton>
              <Heading as="h3" size="md" textAlign="left" flex="1">
                Změna osobních údajů
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <ChangePersonalDataForm
                onSubmit={onSubmitChangePersonalData}
                loading={updateUserLoading}
                error={updateUserError}
              />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Heading as="h3" size="md" textAlign="left" flex="1">
                Změna hesla
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <ChangePasswordForm
                onSubmit={onSubmitChangePassword}
                loading={changePasswordLoading}
                error={changePasswordError}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Card>
    </Box>
  );
};
