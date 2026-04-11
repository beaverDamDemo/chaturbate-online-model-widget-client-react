import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ApiError } from '../../lib/api-client.ts'
import {
  deleteCurrentAccount,
  fetchCurrentUser,
  login,
  logout,
  register,
  type RegisterInput,
  type User,
} from './auth-api.ts'
import { useQueryClient } from '@tanstack/react-query'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from './auth-token-storage.ts'

type AuthContextValue = {
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: RegisterInput) => Promise<void>
  signOut: () => Promise<void>
  deleteAccount: (password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    let isMounted = true

    const loadUser = async () => {
      if (!getAccessToken()) {
        if (isMounted) {
          setIsLoading(false)
        }

        return
      }

      try {
        const currentUser = await fetchCurrentUser()

        if (isMounted) {
          setUser(currentUser)
        }
      } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 401) {
          console.error('Unable to load the current user.', error)
        }

        clearAccessToken()

        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    const authResult = await login(email, password)
    setAccessToken(authResult.accessToken)
    setUser(authResult.user)
  }

  const signUp = async (input: RegisterInput) => {
    if (!input.name || !input.email || !input.password) {
      throw new Error('Name, email, and password are required.')
    }

    const authResult = await register(input)
    setAccessToken(authResult.accessToken)
    setUser(authResult.user)
  }

  const signOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Unable to notify the backend about logout.', error)
    } finally {
      clearAccessToken()
      setUser(null)
      queryClient.clear()
    }
  }

  const deleteAccount = async (password: string) => {
    if (!password.trim()) {
      throw new Error('Password is required to delete your account.')
    }

    try {
      await deleteCurrentAccount(password)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAccessToken()
        setUser(null)
        queryClient.clear()
      }

      throw error
    }

    clearAccessToken()
    setUser(null)
    queryClient.clear()
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        user,
        signIn,
        signUp,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}