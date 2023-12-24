
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      icon: 'basil:add-outline',
      title: 'Create New Job'
    },
    {
      icon: 'material-symbols:work-outline',
      title: 'Job'
    }
  ]
}

export default navigation
