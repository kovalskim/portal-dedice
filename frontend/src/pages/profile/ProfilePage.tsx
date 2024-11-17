import { useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@frontend/context/auth';
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
import { Routes } from '@frontend/routes.ts';

import {
  FormFields as UpdatePreferencesFormFields,
  PreferencesForm,
} from './components/PreferencesForm';

export const ProfilePage = () => {
  const { signIn, user, token, role } = useAuth();
  const navigate = useNavigate();

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

  const [
    updateUserPreferences,
    {
      loading: updateUserPreferencesLoading,
      error: updateUserPreferencesError,
    },
  ] = useMutation(UPDATE_USER_PREFERENCES_MUTATION);

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
      signIn({ token, user: updatedUser, role });

      showToast({
        title: 'Osobní údaje změněny',
        description: 'Vaše osobní údaje byly úspěšně změněny.',
        status: 'success',
      });
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
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitChangePreferences: SubmitHandler<
    UpdatePreferencesFormFields
  > = async (data) => {
    try {
      const updatedPreferences = await updateUserPreferences({
        variables: {
          userId: user?.id,
          emailNotifications: data.emailNotifications,
        },
      });

      if (user)
        signIn({
          token,
          user: {
            ...user,
            emailNotifications:
              updatedPreferences.data.updateUserPreferences.emailNotifications,
          },
          role,
        });

      showToast({
        title: 'Preference změněny',
        description: 'Vaše preference byly úspěšně změněny.',
        status: 'success',
      });
    } catch (err) {
      console.error(err);
    }
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
          base: '90%',
          lg: '80%',
        }}
        p={8}
      >
        <Heading>Můj profil</Heading>
        <Flex
          gap="8"
          my={12}
          mx={6}
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'center', md: 'flex-start' }}
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
            <Text color="fg.muted" fontSize={'lg'}>
              {role}
            </Text>
          </Stack>
        </Flex>

        <Accordion
          allowMultiple
          // ummm next three lines are fixing the accordion bug that all of items are opened when your open the page
          // It seems that defaultIndex={[0]} is broken, so I switched the order and opened last (forst in switched order) item
          defaultIndex={[1, 2]}
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
                error={updateUserPreferencesError}
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
                error={updateUserError}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Card>
    </Box>
  );
};
