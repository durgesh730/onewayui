// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, UserDataType } from './types'
import api from 'src/apiprovider/baseApi'
import { baseUrl } from 'src/apiprovider/baseApi'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const accessToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (accessToken) {
        setLoading(true)
        api
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          .then(res => {
            if (res.data) {
              setUser(res.data)
              localStorage.setItem('userData', JSON.stringify(res.data))
              if (!res.data.company_created) {
                router.replace('/register/company/')
              }
            }
          })
          .catch(e => {
            console.log(e)
            handleLogout()
            router.push('/login')
          })
          .finally(() => {
            setLoading(false) // Set loading to false after the API call, whether success or failure.
          })
      } else {
        //handleLogout()
        setLoading(false)
      }
    }

    // Call initAuth when the URL changes
    initAuth()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  /*
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const accessToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (accessToken) {
        setLoading(true)
        api
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          .then(res => {
            if (res.data) {
              setUser(res.data)
              localStorage.setItem('userData', JSON.stringify(res.data))
              if (!res.data.company_created) {
                router.replace('/register/company/')
              }
              setLoading(false)
            }
          })
          .catch(e => {
            console.log(e)
            handleLogout()
            router.push('/login')
            setLoading(false)
          })
      } else {
        //handleLogout()
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  */

  const handleLogin = (params: LoginParams, errorCallback?: any) => {
    axios
      .post(authConfig.loginEndpoint, params, {})
      .then(async response => {
        params.rememberMe = true // have to be handled
        if (params.rememberMe) {
          localStorage.setItem(authConfig.storageTokenKeyName, `${response.data.access_token}`),
            localStorage.setItem(authConfig.onTokenExpiration, `${response.data.refresh_token}`)
        }

        axios
          .get(`${baseUrl}/user-management/`, {
            headers: {
              Authorization: `Bearer ${response.data.access_token}`
            }
          })
          .then(res => {
            if (res.data.is_verified) {
              setUser({ ...res.data })
              params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(res.data)) : null
              if (!res.data.company_created) {
                router.replace('/register/company/').then(e => setLoading(false))
              } else {
                router.push('/dashboard')
              }
            } else {
              router.replace({
                pathname: '/verify-email/',
                query: {
                  email: params.email
                }
              })
            }
          })
          .catch(err =>
            router.replace({
              pathname: '/verify-email/',
              query: {
                email: params.email
              }
            })
          )
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.onTokenExpiration)
    setLoading(false)
    router.replace('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
