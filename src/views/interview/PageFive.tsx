import { Button, Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Countdown from 'react-countdown'
import AlertDialogSlide from './dialouge/Dialouge'

const PageFive = ({ changePage }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } = useReactMediaRecorder({
    video: true
  })

  const questions = [
    {
      title: 'Tell us about yourself.',
      desc: 'description',
      time: 10 * 1000,
      thinkingTime: 10 * 1000
    },
    {
      title: 'What are your strengths?',
      desc: 'description',
      time: 3 * 60 * 1000,
      thinkingTime: 15 * 1000
    }
  ]
  const [question, setquestion] = useState(0)
  const [showTimer, setShowTime] = useState(true)

  // console.log(showTimer, "showTimer")

  const counterRef = useRef<Countdown>()
  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream
    }
  }, [previewStream])

  const [started, setStarted] = useState(false)
  const [open, setOpen] = useState(false)

  function agree() {
    changePage(7)
  }
  
  return (
    <>
      <Box display={'flex'} flexDirection={'column'} gap={5} mt={2}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button variant='outlined' onClick={() => setOpen(prev => true)}>
            Proceed to Interview
          </Button>
        </Box>

        <Grid container spacing={5} width={{ xs: '100%', lg: '60rem' }}>
          <Grid item className='right' xs={12} lg={7} >
            <Box
              position={'relative'}
              borderRadius={2}
              overflow={'hidden'}
              bgcolor={'black'}
              lineHeight={0}
              sx={{ aspectRatio: '16/9', objectFit: 'cover', }}
            >
              {started ? (
                <Grid container>
                  <Grid item>{status == 'recording' && <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: '5px', objectFit: 'cover', background: 'black' }} />}</Grid>
                  <Grid item>{status == 'stopped' && <video src={mediaBlobUrl as string} autoPlay controls style={{ width: '100%', borderRadius: '5px', objectFit: 'cover', background: 'black' }} />}</Grid>
                </Grid>
              ) : (
                <Box height={'100%'} p={10} top={0} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                  <CountdownCircleTimer
                    isPlaying
                    duration={questions[question].thinkingTime / 1000}
                    size={150}
                    colors={['#7367F0', '#F7B801', '#ff0400']}
                    colorsTime={[6, 4, 0]}
                    onComplete={() => {
                      setStarted(true)
                      counterRef.current.start()
                      startRecording()
                    }}
                  >
                    {({ remainingTime, color }) => (
                      <Typography color={'white'} textAlign={'center'} lineHeight={'1ch'}>
                        starts in
                        <Typography fontSize={'3rem'} color={color}>
                          {remainingTime}
                        </Typography>
                      </Typography>
                    )}
                  </CountdownCircleTimer>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item className='left' xs={12} lg={5}>
          <Typography> Question {question+1} of {questions.length}</Typography>

            <Typography fontSize={'1.3rem'} fontWeight={'bold'}>
              {questions[question].title}
            </Typography>
            <Typography>{questions[question].desc} </Typography>

            <Countdown // countdown
              autoStart={false}
              ref={counterRef}
              date={Date.now() + questions[question].time}
              onComplete={() => {
                stopRecording()
                setShowTime(false)
                console.log('finished')
              }}
              renderer={({ minutes, seconds, total, completed, api }) =>
                showTimer && (
                  <Typography ml={2} display={'inline'} my={1} variant='h6' mt={5}>
                    <p>
                      {' '}
                      Remaining Time :{minutes}:{seconds}
                    </p>
                  </Typography>
                )
              }
            />

            <Typography my={4}></Typography>

            {started ? (
              status != 'stopped' ? (
                <Button
                  variant='contained'
                  onClick={() => {
                    counterRef.current.api.stop()
                    setShowTime(false)
                    stopRecording()
                  }}
                >
                  Stop Recording
                </Button>
              ) : (
                <>
                  <Button
                    variant='contained'
                    onClick={() => {
                      setStarted(true)
                      setShowTime(true)
                      counterRef.current.start()
                      startRecording()
                    }}
                    sx={{ mr: 2 }}
                  >
                    Retake
                  </Button>
                  {questions.length > question + 1 ? (
                    <Button
                      variant='contained'
                      onClick={() => {
                        setquestion(prev => prev + 1)
                        setStarted(false)
                        setShowTime(true)
                      }}
                    >
                      Save & Continue
                    </Button>
                  ) : (
                    <Button variant='contained' onClick={() => setOpen(prev => true)}>
                      Finish Practice
                    </Button>
                  )}
                </>
              )
            ) : (
              <Button
                variant='contained'
                onClick={() => {
                  setStarted(true)
                  counterRef.current.start()
                  startRecording()
                }}
              >
                Start Recording
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      <AlertDialogSlide open={open} setOpen={setOpen} agree={agree} />
    </>
  )
}

export default PageFive
