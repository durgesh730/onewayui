import { Icon } from '@iconify/react'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const PageTwo = ({ changePage }: any) => {
  const askForPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      })
      changePage(4)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 8, gap: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box display='flex' fontSize='2rem' alignItems='center'>
        <Icon icon='solar:camera-bold' />
        {'+'}
        <Icon icon='eva:mic-fill' />
      </Box>
      <Typography fontSize='1.2rem' fontWeight='800'>
        Camera and Microphone access is needed <br /> to continue
      </Typography>
      <Button variant='contained' onClick={() => askForPermission()} sx={{ mt: 3 }}>
        Grant permission
      </Button>
    </Box>
  )
}

export default PageTwo
