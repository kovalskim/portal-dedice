import { useMutation } from '@apollo/client';
import { defineStyle } from '@chakra-ui/icons';
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

import { Role, useAuth } from '@frontend/context/auth/auth-core';
import {
  CHANGE_PASSWORD_MUTATION,
  UPDATE_USER_MUTATION,
  UPDATE_USER_PREFERENCES_MUTATION,
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
import { CriteriaView } from '@frontend/pages/profile/components/CriteriaView.tsx';

import {
  FormFields as UpdatePreferencesFormFields,
  PreferencesForm,
} from './components/PreferencesForm';

export const ProfilePage = () => {
  const { signIn, user, token, role } = useAuth();

  const showToast = useCustomToast();

  const ringCss = defineStyle({
    outlineWidth: '2px',
    outlineColor: 'colorPalette.500',
    outlineOffset: '2px',
    outlineStyle: 'solid',
  });

  const [updateUser, { loading: updateUserLoading }] = useMutation(
    UPDATE_USER_MUTATION,
    {
      onError: () => {
        showToast({
          title: 'Něco se pokazilo',
          description:
            'Nepodařilo se uložit osobní údaje. Zkuste to prosím znovu.',
          status: 'error',
        });
      },
      onCompleted: (data) => {
        const updatedUser = data.updateUser;
        signIn({ token, user: updatedUser, role });

        showToast({
          title: 'Osobní údaje změněny',
          description: 'Vaše osobní údaje byly úspěšně změněny.',
          status: 'success',
        });
      },
    },
  );

  const [
    changePassword,
    { loading: changePasswordLoading, error: changePasswordError },
  ] = useMutation(CHANGE_PASSWORD_MUTATION, {
    onError: () => {
      showToast({
        title: 'Chybné heslo.',
        description: 'Zadejte, prosím, správné heslo.',
        status: 'error',
      });
    },
    onCompleted: () => {
      showToast({
        title: 'Heslo změněno',
        description: 'Vaše heslo bylo úspěšně změněno.',
        status: 'success',
      });
    },
  });

  const [updateUserPreferences, { loading: updateUserPreferencesLoading }] =
    useMutation(UPDATE_USER_PREFERENCES_MUTATION, {
      onError: () => {
        showToast({
          title: 'Něco se pokazilo',
          description:
            'Nepodařilo se uložit osobní údaje. Zkuste to prosím znovu.',
          status: 'error',
        });
      },
      onCompleted: (data) => {
        if (user) {
          signIn({
            token,
            user: {
              ...user,
              emailNotifications: data.updateUserPreferences.emailNotifications,
            },
            role,
          });
        }

        showToast({
          title: 'Preference změněny',
          description: 'Vaše preference byly úspěšně změněny.',
          status: 'success',
        });
      },
    });

  const onSubmitChangePersonalData: SubmitHandler<
    ChangePersonalDataFormFields
  > = async (data) => {
    await updateUser({
      variables: {
        userId: user?.id,
        beforeTitle: data.beforeTitle,
        firstname: data.firstname,
        lastname: data.lastname,
        afterTitle: data.afterTitle,
      },
    });
  };

  const onSubmitChangePassword: SubmitHandler<
    ChangePasswordFormFields
  > = async (data) => {
    await changePassword({
      variables: {
        userId: user?.id,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
    });
  };

  const onSubmitChangePreferences: SubmitHandler<
    UpdatePreferencesFormFields
  > = async (data) => {
    await updateUserPreferences({
      variables: {
        userId: user?.id,
        emailNotifications: data.emailNotifications,
      },
    });
  };

  if (!user) {
    return null;
  }

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
          md: '80%',
        }}
        p={{ base: 6, md: 12 }}
      >
        <Heading size="lg">Nastavení profilu</Heading>
        <Flex
          gap="8"
          my={{ base: 6, md: 12 }}
          mx={{ base: 0, md: 12 }}
          direction={{ base: 'column', md: 'row' }}
          justifyContent="center"
          alignItems="center"
          textAlign={{ base: 'center', md: 'left' }}
        >
          <Avatar
            name={`${user.firstname} ${user.lastname}`}
            size="xl"
            css={ringCss}
          />
          <Stack gap="0">
            <Text fontWeight="medium" fontSize="2xl">
              {`${user.beforeTitle ? user.beforeTitle + ' ' : ''}${user.firstname} ${user.lastname}${user.afterTitle ? `, ${user.afterTitle}` : ''}`}
            </Text>
            <Text color="fg.muted" fontSize={'lg'}>
              {user.email}
            </Text>
          </Stack>
        </Flex>

        <Accordion
          allowMultiple
          // ummm next three lines are fixing the accordion bug that all of items are opened when your open the page
          // It seems that defaultIndex={[0]} is broken, so I switched the order and opened last (forst in switched order) item
          defaultIndex={[3, 2]}
          display={'flex'}
          flexDirection={'column-reverse'}
        >
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

          <AccordionItem>
            <AccordionButton>
              <Heading as="h3" size="md" textAlign="left" flex="1">
                Preference
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <PreferencesForm
                onSubmit={onSubmitChangePreferences}
                loading={updateUserPreferencesLoading}
              />
            </AccordionPanel>
          </AccordionItem>

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
              />
            </AccordionPanel>
          </AccordionItem>

          {role === Role.NOTARY && (
            <AccordionItem>
              <AccordionButton>
                <Heading as="h3" size="md" textAlign="left" flex="1">
                  Kritéria přiřazování případů
                </Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <CriteriaView />
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </Card>
    </Box>
  );
};
