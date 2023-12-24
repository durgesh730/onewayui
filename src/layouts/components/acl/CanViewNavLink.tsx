import { ReactNode } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { NavLink } from 'src/@core/layouts/types'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  const { children, navLink } = props

  const auth = useAuth()

  if (auth.user || (navLink && navLink.auth === false)) {
    return <>{children}</>
  } else {
    return null
  }
}

export default CanViewNavLink
