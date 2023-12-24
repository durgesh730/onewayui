// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import UserProfile from 'src/views/account/user-profile/UserProfile'


const UserProfileTab = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserProfile tab={tab} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'view' } },
      { params: { tab: 'edit' } }
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

export default UserProfileTab
