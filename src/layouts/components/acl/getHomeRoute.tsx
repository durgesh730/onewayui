import themeConfig from 'src/configs/themeConfig'

const getHomeRoute = (role: string) => {
  if (role === 'client') return '/acl'
  else return themeConfig.baseUrl
}

export default getHomeRoute
