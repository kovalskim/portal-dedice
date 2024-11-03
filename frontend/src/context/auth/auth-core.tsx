import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

export type AuthUser = {
  id: string;
  beforeTitle: string | null;
  firstname: string;
  lastname: string;
  email: string;
  afterTitle: string | null;
};

const LOCAL_STORAGE_AUTH_KEY = 'project-auth';

const initialState: AuthState = {
  token: null,
  user: null,
};

const AuthContext = createContext(
  createContextValue({
    token: initialState.token,
    user: initialState.user,
    setState: () =>
      console.error('You are using AuthContext without AuthProvider!'),
  }),
);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [state, setState] = usePersistedAuth(initialState);

  const contextValue = useMemo(() => {
    const { token, user } = state;
    return createContextValue({ token, user, setState });
  }, [state, setState]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

function createContextValue({
  token,
  user,
  setState,
}: AuthState & {
  setState: (newState: AuthState) => void;
}) {
  return {
    token,
    user,
    signIn: ({ token, user }: AuthState) => setState({ token, user }),
    signOut: () => setState({ token: null, user: null }),
  };
}

function usePersistedAuth(
  defaultState: AuthState,
): [AuthState, (newState: AuthState) => void] {
  const [state, setStateRaw] = useState(() => getStorageState(defaultState));

  const setState = useCallback((newState: AuthState) => {
    setStateRaw(newState);
    setStorageState(newState);
  }, []);

  return [state, setState];
}

function getStorageState(defaultState: AuthState): AuthState {
  if (!window.localStorage) {
    return defaultState;
  }

  const rawData = window.localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  if (!rawData) {
    return defaultState;
  }

  try {
    const { user, token } = JSON.parse(rawData);

    if (token && user && user.id && user.firstname) {
      return { token, user };
    }
  } catch {}

  return defaultState;
}

function setStorageState(newState: AuthState) {
  if (!window.localStorage) {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(newState));
}
