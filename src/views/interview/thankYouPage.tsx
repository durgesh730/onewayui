import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

const ThankYouPage = ({ changePage, apiResult }: any) => {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography fontSize='1rem' fontWeight='600'>
        Thank You
      </Typography>

      <Typography fontSize='1.5rem' fontWeight='900'>
        { apiResult.job_title } at { apiResult.company_name }
      </Typography>

      <Typography>
        { apiResult.thank_you_message }
      </Typography>
    </Box>
  );
};

export default ThankYouPage;