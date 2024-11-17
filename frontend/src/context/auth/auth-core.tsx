import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  NOTARY = 'notary',
}

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  role: Role | null;
};

export type AuthUser = {
  id: string;
  beforeTitle: string | null;
  firstname: string;
  lastname: string;
  email: string;
  afterTitle: string | null;
  emailNotifications: boolean;
};

const LOCAL_STORAGE_AUTH_KEY = 'project-auth';

const initialState: AuthState = {
  token: null,
  user: null,
  role: null,
};

const AuthContext = createContext(
  createContextValue({
    token: initialState.token,
    user: initialState.user,
    role: initialState.role,
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
    const { token, user, role } = state;
    return createContextValue({ token, user, role, setState });
  }, [state, setState]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

function createContextValue({
  token,
  user,
  role,
  setState,
}: AuthState & {
  setState: (newState: AuthState) => void;
}) {
  return {
    token,
    user,
    role,
    signIn: ({ token, user, role }: AuthState) =>
      setState({ token, user, role }),
    signOut: () => setState({ token: null, user: null, role: null }),
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
    const { user, token, role } = JSON.parse(rawData);

    if (token && user && user.id && user.firstname && role) {
      return { token, user, role };
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
