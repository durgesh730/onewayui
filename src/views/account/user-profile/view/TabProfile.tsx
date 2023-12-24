import Grid from '@mui/material/Grid'
import AboutOverview from 'src/views/account/user-profile/view/AboutOverview'
import ChangePasswordCard from 'src/views/account/user-profile/view/ChangePasswordCard'

const ProfileTab = () => {
  return (
    <Grid container spacing={6}>
      <Grid item lg={3} md={5} xs={12}>
        <AboutOverview />
      </Grid>
      <Grid item lg={9} md={7} xs={12}>
        <ChangePasswordCard/>
      </Grid>
    </Grid>
  )
}

export default ProfileTab
