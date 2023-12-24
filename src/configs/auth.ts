import { baseUrl } from 'src/apiprovider/baseApi'


export default {
  meEndpoint: `${baseUrl}/user-management/`,
  loginEndpoint: `${baseUrl}/login/tokens`,
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
