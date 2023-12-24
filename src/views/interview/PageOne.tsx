import { Icon } from '@iconify/react'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import React from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'

const PageOne = ({ changePage, apiResult }: any) => {

  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography fontSize='1rem' fontWeight='600'>
        Video Interview
      </Typography>
      <Typography fontSize='1.5rem' fontWeight='900'>
        {apiResult.job_title} at {apiResult.company_name}
      </Typography>
      <Box mt={7} textAlign='left' sx={{ width: { md: '35rem', xs: 'fit-content' } }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Please fill in this form to continuing to the interview </Typography>
          </Grid>
          <Grid item xs={6}>
            <CustomTextField disabled id='form-props-disabled' label='First Name' defaultValue={apiResult.first_name} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <CustomTextField disabled id='form-props-disabled' label='Last Name' defaultValue={apiResult.last_name} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField disabled id='form-props-disabled' label='Email' defaultValue={apiResult.email} fullWidth />
          </Grid>
        </Grid>

        <Box
          display='flex'
          justifyContent='center'
          gap='1rem' mt={4}
          alignItems='center'
          sx={{
            '@media (max-width: 500px)': {
              display: 'block',
              textAlign: "center"
            },
          }}
        >
          <Button
            sx={{
              '@media (max-width: 500px)': {
                width: "100%"
              },
            }}
            variant='contained' onClick={() => changePage(3)}>
            Let's Start
          </Button>

          <Box sx={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            '@media (max-width: 500px)': {
              paddingTop: "1rem",
            },
          }} >
            <Box display='flex' alignItems='center' gap={1} color='gray'>
              <Icon icon='ic:sharp-alarm' /> {apiResult.total_required_time} min
            </Box>
            <Box display='flex' alignItems='center' gap={1} color={'grey'}>
              <Icon icon='octicon:question-16' /> {apiResult.total_questions} Questions
            </Box>
          </Box>
        </Box>


        <Box textAlign='center' mt={8}>
          <Typography variant='body2'>
            By clicking Let's start you agree to our terms and conditions
            <br />
            <Link href={'/'}>Terms and Conditions</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default PageOne