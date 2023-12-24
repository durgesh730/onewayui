import { ReactNode } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { NavSectionTitle } from 'src/@core/layouts/types'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

const CanViewNavSectionTitle = (props: Props) => {
  const { children, navTitle } = props
  const auth = useAuth()

  if (auth.user || (navTitle && navTitle.auth === false)) {
    return <>{children}</>
  } else {
    return null
  }
}

export default CanViewNavSectionTitle
