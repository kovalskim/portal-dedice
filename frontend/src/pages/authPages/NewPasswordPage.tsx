import { useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import {
  Box,
  Flex,
  Heading,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  NEW_PASSWORD_MUTATION,
  VERIFY_TOKEN_MUTATION,
} from '@frontend/gql/user/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import {
  FormFields,
  NewPasswordForm,
} from '@frontend/pages/authPages/components/NewPasswordForm.tsx';
import { Routes } from '@frontend/routes/routes.ts';

export const NewPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const showToast = useCustomToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const hasVerified = useRef(false);

  const [changePassword, { loading: changePasswordLoading }] = useMutation(
    NEW_PASSWORD_MUTATION,
    {
      onError: () => {
        showToast({
          title: 'Heslo se nepodařilo změnit',
          description: 'Nastala chyba při změně hesla, zkuste to znovu.',
          status: 'error',
        });
        navigate(Routes.logIn);
      },
      onCompleted: () => {
        showToast({
          title: 'Heslo bylo změněno',
          description:
            'Vaše heslo bylo úspěšně změněno, nyní se můžete přihlásit',
          status: 'success',
        });
        navigate(Routes.logIn);
      },
    },
  );

  const [verifyToken] = useMutation(VERIFY_TOKEN_MUTATION, {
    onError: () => {
      showToast({
        title: 'Neplatný token',
        description: 'Zadaný token je neplatný, zkuste ověření znovu.',
        status: 'error',
      });
      navigate(Routes.forgottenPassword);
    },
  });

  useEffect(() => {
    (async () => {
      if (token && !hasVerified.current) {
        hasVerified.current = true;
        await verifyToken({ variables: { token } });
      }
    })();
  }, [token, hasVerified, verifyToken]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await changePassword({
      variables: {
        newPassword: data.password,
        token: token,
      },
    });
  };

  return (
    <>
      {isMobile ? (
        <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
          <Box
            w="90%"
            bg="white"
            py={10}
            px={12}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            boxShadow="lg"
            borderRadius="lg"
          >
            <NewPasswordForm
              onSubmit={onSubmit}
              loading={changePasswordLoading}
            />
          </Box>
        </Flex>
      ) : (
        <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
          <Flex
            width={{
              md: '90%',
              lg: '80%',
            }}
            boxShadow="lg"
            borderRadius="lg"
          >
            <Flex
              w="45%"
              bg="goldenYellow.500"
              color="white"
              px={10}
              py={24}
              direction="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderLeftRadius="lg"
            >
              <Heading size="lg" mb={12} lineHeight="3rem">
                Nové heslo
              </Heading>
              <Image src="/new-password.png" width="300px" />
            </Flex>
            <Box
              w="55%"
              bg="white"
              py="10"
              px={{
                md: '12',
                lg: '16',
                xl: '20',
              }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              borderRightRadius="lg"
            >
              <NewPasswordForm
                onSubmit={onSubmit}
                loading={changePasswordLoading}
              />
            </Box>
          </Flex>
        </Flex>
      )}
    </>
  );
};
