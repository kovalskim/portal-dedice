import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  TokenPayload,
  VERIFY_TOKEN_MUTATION,
} from '@frontend/gql/user/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';

export const useTokenVerification = (
  tokenName: string,
  defaultRoute: string,
) => {
  const location = useLocation();
  const showToast = useCustomToast();
  const navigate = useNavigate();

  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const hasVerified = useRef(false);
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get(tokenName);

  const [verifyToken, { loading }] = useMutation<TokenPayload>(
    VERIFY_TOKEN_MUTATION,
    {
      onCompleted: (data) => {
        setPayload(data);
      },
      onError: () => {
        showToast({
          title: 'Neplatný token',
          description: 'Zadaný token je neplatný, zkuste ověření znovu.',
          status: 'error',
        });
        navigate(defaultRoute);
      },
    },
  );

  useEffect(() => {
    (async () => {
      if (token && !hasVerified.current) {
        hasVerified.current = true;
        await verifyToken({ variables: { token } });
      }
    })();
  }, [token, hasVerified, setPayload, verifyToken]);

  return { token, tokenVerificationLoading: loading, payload };
};
