// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import { useState, useEffect } from 'react'
import { string } from 'yup'
import { useAuth } from 'src/hooks/useAuth'

const AboutOverview = () => {
  type data = {
    [key: string]: {
      value: string
      icon: string
    }
  }

  const getUserCompanyRole = (userData) => {
    if (userData.admin_companies && userData.admin_companies.company_name) {
      return "Admin";
    } else if (userData.managed_companies?.length > 0) {
      return "Manager";
    } else if (userData.exe_companies?.length > 0) {
      return "Executive";
    } else {
      try{
        const data = JSON.parse(localStorage.getItem('userData'));
        if (data.admin_companies && data.admin_companies.company_name) {
          return "Admin";
        } else if (data.managed_companies.length > 0) {
          return "Manager";
        } else if (data.exe_companies.length > 0) {
          return "Executive";
        };
      }
      catch (e) {
        console.log(e);
      }
      return null; // No company found
    }
  };

  const getUserCompanyName = (userData) => {
    if (userData.admin_companies && userData.admin_companies.company_name) {
      return userData.admin_companies.company_name;
    } else if (userData.managed_companies?.length > 0) {
      return userData.managed_companies[0].company_name;
    } else if (userData.exe_companies?.length > 0) {
      return userData.exe_companies[0].company_name;
    } else {
      try{
        const data = JSON.parse(localStorage.getItem('userData'));
        if (data.admin_companies && data.admin_companies.company_name) {
          return data.admin_companies.company_name;
        } else if (data.managed_companies.length > 0) {
          return data.managed_companies[0].company_name;
        } else if (data.exe_companies.length > 0) {
          return data.exe_companies[0].company_name;
        };
      }
      catch (e) {
        console.log(e);
      }
      return null; // No company found
    }
  };
  
  const auth = useAuth()

  const user: data = {
    fullName: {
      icon: 'solar:user-linear',
      value: auth.user?.first_name + ' ' + auth.user?.last_name
    },
    status: {
      icon: 'pajamas:status',
      value: 'Active'
    },
    title: {
      icon: 'material-symbols:title',
      value: getUserCompanyRole(auth.user || null)
    },
    country: {
      icon: 'ep:location',
      value: auth.user?.location
    },
    language: {
      icon: 'ion:language',
      value: auth.user?.language
    }
  }

  const contact: data = {
    email: {
      value: auth.user?.email,
      icon: 'clarity:email-line'
    }
  }

  const [about, setAbout] = useState<data>(user)
  const [contacts, setContacts] = useState<data>(contact)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                About
              </Typography>
              {Object.entries(about).map(([key, value], idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 3 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={value.icon} />

                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                    {key}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{value.value}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                Contacts
              </Typography>
              {Object.entries(contacts).map(([key, value], idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:not(:last-of-type)': { mb: 3 }
                  }}
                >
                  <Icon fontSize='1.25rem' icon={value.icon} />

                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                    {key}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{value.value}</Typography>
                </Box>
              ))}
            </Box>
            <div>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                Organization
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 3 }
                }}
              >
                <Icon fontSize='1.25rem' icon='charm:organisation' />
                <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                  {getUserCompanyName(auth.user || null)}
                </Typography>
              </Box>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverview
