export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  // not required
  role?: string | any
  username?: string | any
  password?: string | any
  fullName?: string | any
  // required
  created_at?: string | any
  custom_data?: string | any
  email?: string | any
  first_name?: string | any
  groups?: string | any
  id?: string | any
  is_verified?: string | any
  is_whatsapp_active?: string | any
  language?: string | any
  last_login?: string | any
  last_name?: string | any
  mobile_number?: string | any
  profile_pic?: string | any
  timezone?: string | any
  updated_at?: string | any
  user_permissions?: string | any
  whatsapp_number?: string | any
  company_created?: string | any
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
