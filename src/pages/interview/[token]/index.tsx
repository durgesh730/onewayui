import { Card, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React, { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import InterviewContent from 'src/views/interview'


const index = () => {
  const theme = useTheme()

  return (
    <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh' sx={{ padding: '1rem' }}>
      <Card elevation={5} sx={{ padding: '2.5rem' }}>
        {/* header */}
        <Box display='flex' alignItems='center' gap={2}>
          <div className='logo'>
            <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
              />
            </svg>
          </div>
          <Typography variant='subtitle1' fontWeight='bold'>
            HireLimitless  
          </Typography>
        </Box>
        {/* body */}
        <InterviewContent/>
      </Card>
    </Box>
  )
}

index.authGuard = false
index.guestGuard = false
index.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>


export default index
