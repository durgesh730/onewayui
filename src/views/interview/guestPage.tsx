import { Icon } from '@iconify/react'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import React, { useState } from 'react'
import Router from 'next/router'
import { createCandidate } from 'src/apiprovider/interview/candidates'

const GuestPage = ({ changePage, apiResult }: any) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    job: apiResult.job_id,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Assuming you have a function named CandidateForm that accepts JSON data
    const { token } = Router.query;
    createCandidate(formData, token)
      .then((res) => {
        Router.push(res.url);
      })
      .catch((error) => {
        return error
      })

    // Redirect to the next page
    //changePage(2);
  };

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
          <Grid item xs={20}>
            <Typography>Please fill in this form to continuing to the interview </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField label='First Name'
              variant='outlined' fullWidth
              placeholder='John'
              name='firstName'
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField label='Last Name'
              variant='outlined'
              fullWidth
              placeholder='Doe'
              name='lastName'
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label='Email'
              variant='outlined'
              fullWidth
              name='email'
              placeholder='John.Doe@gmail.com'
              value={formData.email}
              onChange={handleInputChange}
            />
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
          <Button variant='contained'
            sx={{
              '@media (max-width: 500px)': {
                width: "100%"
              },
            }}
            onClick={() => handleSubmit()}>
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
              <Icon icon='ic:sharp-alarm' />  {apiResult.total_required_time} Min
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
    </Box >
  )
}

export default GuestPage
