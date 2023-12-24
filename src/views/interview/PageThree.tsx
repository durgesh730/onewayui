import { Icon } from '@iconify/react'
import { Button, LinearProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { baseAPI } from 'src/apiprovider/baseApi'

const PageThree = ({ changePage }: any) => {
  const [isConnected, setIsConnected] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let timer: any
    let endTime: any

    // Function to perform the network connectivity test
    const checkConnectivity = async () => {
      try {
        const startTime = Date.now()
        await baseAPI.get('/doc/re-doc/')
        endTime = Date.now()
        const responseTime = endTime - startTime

        // Check if the response time is within an acceptable range
        if (responseTime <= 3000) {
          setIsConnected(true)
        } else {
          setIsConnected(false)
        }
      } catch (error) {
        setIsConnected(false)
      }
    }

    // Start the timer and perform the connectivity test every 1 second
    const startTimer = () => {
      timer = setInterval(() => {
        checkConnectivity()
      }, 1000)
    }

    // Stop the timer and clean up
    const stopTimer = () => {
      clearInterval(timer)
    }

    // Start the timer
    if (navigator.onLine) {
      startTimer()
    } else {
      setIsConnected(false)
    }

    // Stop the timer after 8 seconds
    setTimeout(() => {
      stopTimer()
      changePage(5)
    }, 10000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (!isConnected) {
      return changePage(1)
    }
  }, [isConnected])

  return (
    <Box sx={{ textAlign: 'center', mt: 8, gap: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width: { md: '35rem', xs: 'fit-content' } }} >
      <Typography fontSize='1.1rem' fontWeight='800'>
        Checking Internet Connectivity
      </Typography>
      <Box mt={5}>
        <LinearProgress />
        <Typography mt={2}>
          Network Status: <b>{isConnected ? 'Good' : 'Poor'}</b>
        </Typography>
      </Box>
    </Box>
  )
}

export default PageThree
