import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      icon: 'basil:add-outline',
      title: 'Create New Job',
      path: '/jobs/create'
    },
    {
      icon: 'material-symbols:work-outline',
      title: 'Jobs',
      path: '/dashboard'
    },
    {
      icon: 'fluent:people-16-regular',
      title: 'Candidate',
      path : '/candidates'
    },
  ]
}


export default navigation
