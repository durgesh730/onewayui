import { Button, Grid, MenuItem, Select, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useEffect, useRef } from 'react'

type Device = MediaDeviceInfo & { kind: 'audioinput' | 'videoinput' }

const PageFour = ({ changePage }: any) => {
  const [micDevices, setMicDevices] = useState<Device[]>([])
  const [cameraDevices, setCameraDevices] = useState<Device[]>([])
  const [selectedMicDevice, setSelectedMicDevice] = useState<string>('') // Default empty value
  const [selectedCameraDevice, setSelectedCameraDevice] = useState<string>('') // Default empty value
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Function to fetch input devices
    const fetchInputDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const micList = devices.filter(device => device.kind === 'audioinput') as Device[]
        const cameraList = devices.filter(device => device.kind === 'videoinput') as Device[]

        setMicDevices(micList)
        setCameraDevices(cameraList)
      } catch (error) {
        console.error('Error enumerating devices:', error)
      }
    }

    // Call the fetchInputDevices function
    fetchInputDevices()
  }, [])

  useEffect(() => {
    // Function to request microphone and camera access with selected devices
    const requestMediaAccess = async () => {
      try {
        if (selectedMicDevice || selectedCameraDevice) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: selectedMicDevice ? { deviceId: selectedMicDevice } : false,
            video: selectedCameraDevice ? { deviceId: selectedCameraDevice } : false
          })
          setStream(mediaStream)
          setError(null)
        } else {
          setStream(null)
          setError(null)
        }
      } catch (err: any) {
        setError(err)
      }
    }

    requestMediaAccess()

    // Clean up the stream when the component is unmounted
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [selectedMicDevice, selectedCameraDevice])

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    // Request media access with default devices when the component mounts
    if (!selectedMicDevice && !selectedCameraDevice && micDevices.length > 0 && cameraDevices.length > 0) {
      setSelectedMicDevice(micDevices[0].deviceId)
      setSelectedCameraDevice(cameraDevices[0].deviceId)
    }
  }, [micDevices, cameraDevices, selectedMicDevice, selectedCameraDevice])

  const handleMicDeviceChange = (event: any) => {
    setSelectedMicDevice(event.target.value)
  }

  const handleCameraDeviceChange = (event: any) => {
    setSelectedCameraDevice(event.target.value)
  }

  return (
    <Box mt={10} sx={{
      width: {
        md: '60rem', xs: 'fit-content',
      },
      '@media (max-width: 500px)': {
        width: "100%"
      }
    }}
    >
      <Grid container spacing={5}>
        <Box sx={{
          display: "flex", justifyContent: "space-between",
          gap: "2rem",
          '@media (max-width: 1200px)': {
            display: 'block',
          },
        }} >
          <Grid
            item xs={12} md={0} lineHeight={0}
            sx={{
              '@media (max-width: 1200px)': {
                display: "flex",
                justifyContent: "center",
                paddingBottom: "1rem"
              },
            }}
          >
            {stream && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className='pagefourVideo'
              />
            )}
          </Grid>

          <Grid item xs={12} sx={{
            width: { md: '30rem', xs: 'fit-content' },
            '@media (max-width: 500px)': {
              width: "100%"
            }
          }} >
            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
              <Typography fontWeight={'bold'}
                sx={{
                  '@media (max-width: 500px)': {
                    display: 'none',
                  },
                }} >
                Microphone Devices
              </Typography>

              <Select
                sx={{
                  '@media (max-width: 500px)': {
                    display: 'none',
                  },
                }}
                value={selectedMicDevice} onChange={handleMicDeviceChange}>
                {micDevices.map(device => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId}`}
                  </MenuItem>
                ))}
              </Select>
              <Typography
                sx={{
                  '@media (max-width: 500px)': {
                    display: 'none',
                  },
                }}
                fontWeight={'bold'}>
                Camera Devices
              </Typography>
              <Select
                sx={{
                  '@media (max-width: 500px)': {
                    display: 'none',
                  },
                }}
                value={selectedCameraDevice} onChange={handleCameraDeviceChange}>
                {cameraDevices.map(device => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId}`}
                  </MenuItem>
                ))}
              </Select>
              {error && <div>Error: {error.message}</div>}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: "1rem",
                  gap: "3rem",
                  '@media (max-width: 500px)': {
                    display: 'block',
                    width: "100%",
                    margin: "auto",
                    textAlign: "center",
                  },
                }}
              >
                <Button
                  sx={{
                    width: "50%",
                    padding: ".8rem 0rem",
                    '@media (max-width: 500px)': {
                      width: "100%",
                      textAlign: "center"
                    },
                  }}
                  variant='contained'
                  onClick={() => changePage(7)}>
                  Start Interview
                </Button>

                <Button
                  sx={{
                    padding: ".8rem 0rem",
                    width: "50%",
                    '@media (max-width: 500px)': {
                      width: "100%",
                      marginTop: ".5rem",
                      textAlign: "center"
                    },
                  }}
                  variant='contained' onClick={() => changePage(6)}>
                  Practice Test
                </Button>
              </Box>

            </Box>
          </Grid>
        </Box>
      </Grid>
    </Box>
  )
}

export default PageFour
