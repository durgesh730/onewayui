import { Button, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Countdown from 'react-countdown'
import { useReactMediaRecorder } from 'react-media-recorder';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { fetchQuestions, saveAnswer } from 'src/apiprovider/interview/candidates'
import ProgressCircularIndeterminate from './Loader'

const PageSix = ({ changePage }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { status, clearBlobUrl, startRecording, stopRecording, mediaBlobUrl, previewStream } = useReactMediaRecorder({
    video: true
  })

  function convertTimeStringToDate(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    const currentTime = new Date();
    const futureTime = new Date(currentTime);

    futureTime.setHours(currentTime.getHours() + hours);
    futureTime.setMinutes(currentTime.getMinutes() + minutes);
    futureTime.setSeconds(currentTime.getSeconds() + seconds);

    return futureTime;
  }

  function convertToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    return hours * 60 * 60 + minutes * 60 + seconds;
  }

  const handleVideoMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const counterRef = useRef<Countdown>()

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream
    }
  }, [previewStream])


  const demoQuestions = {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "answered_questions": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "title": "string",
        "description": "string",
        "takes": 2147483647,
        "thinking_time": "string",
        "allowed_time": "string",
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z",
        "active": true,
        "created_by": 0,
        "job": "4bbaedb0-902b-4b27-8218-8f40d3470a54"
      }
    ],
    "unanswered_questions": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "title": "string",
        "description": "string",
        "takes": 2147483647,
        "thinking_time": "string",
        "allowed_time": "string",
        "created_at": "2019-08-24T14:15:22Z",
        "updated_at": "2019-08-24T14:15:22Z",
        "active": true,
        "created_by": 0,
        "job": "4bbaedb0-902b-4b27-8218-8f40d3470a54"
      }
    ]
  };
  const [videoDuration, setVideoDuration] = useState<number | null>(30);
  const [started, setStarted] = useState(false);
  const [jobQuestions, setJobQuestions] = useState(demoQuestions);
  const [question, setQuestion] = useState(0);
  const [showTimer, setShowTime] = useState(true);
  const [answerToken, setToken] = useState<String | String[]>('');
  const router = useRouter();
  const [upload, setUpload] = useState(false)

  const handleRetake = () => {
    clearBlobUrl();
    setStarted(false);
    setShowTime(true);
  };

  useEffect(() => {
    async function fetchJobQuestions() {
      try {
        const { token } = router.query;
        setToken(token);
        const response = await fetchQuestions(token);
        setJobQuestions(response);
      } catch (error) { }
    }
    fetchJobQuestions();
  }, []);

  useEffect(() => {
    if (started) {
      counterRef.current.start();
      startRecording();
    }
  }, [started]);

  const handleSaveAndContinue = () => {
    if (mediaBlobUrl) {
      const curr_answer = {
        "video": mediaBlobUrl,
        "takes": 3,
        "video_length": videoDuration,
        "question": jobQuestions.unanswered_questions[question].id
      };
      setUpload(true);
      saveAnswer(curr_answer, answerToken)
        .then((res) => {
          setUpload(false);
          setQuestion(prev => prev + 1);
          clearBlobUrl();
          setStarted(false);
          setShowTime(true);
        })
        .catch((err) => {
          setUpload(false);
        });
    }
  };

  const handleSubmit = () => {
    setUpload(true);
    if (mediaBlobUrl) {
      saveAnswer({ "video": mediaBlobUrl, "takes": 3, "video_length": videoDuration, "question": jobQuestions.unanswered_questions[question].id }, answerToken)
        .then((res) => {
          setUpload(false);
          changePage(8)
        })
        .catch((err) => {
          setUpload(false);
        });
    }
  }

  return (
    <Box display={'flex'} gap={5} mt={10}>
      {upload ? (
        <Box width={{ xs: '100%', sm: '30rem' }} >
          <ProgressCircularIndeterminate />
        </Box>
      ) : (
        <Grid container display={'flex'} spacing={5} width={{ xs: '100%', sm: '50rem' }}
          sx={{
            '@media (max-width: 500px)': {
              width: "100%"
            },
          }}
        >
          <Grid item className='right' xs={12} lg={7}
            sx={{
              '@media (max-width: 500px)': {
                width: "100%"
              },
            }}
          >
            <Box
              position={'relative'}
              borderRadius={2}
              overflow={'hidden'}
              bgcolor={'black'}
              lineHeight={0}
              sx={{
                aspectRatio: '16/9',
                '@media (max-width: 500px)': {
                  width: "16rem"
                },
              }}
            >
              {!started && (
                <Box
                  position={'absolute'}
                  top={0}
                  left={0}
                  width={'100%'}
                  height={'100%'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  bgcolor={'black'}
                  sx={{
                    '@media (max-width: 500px)': {
                      width: "100%"
                    },
                  }}
                >
                  <CountdownCircleTimer
                    isPlaying
                    duration={convertToSeconds(jobQuestions.unanswered_questions[question].thinking_time)}
                    size={140}
                    colors={['#7367F0', '#F7B801', '#ff0400']}
                    colorsTime={[6, 4, 0]}
                    onComplete={() => {
                      setStarted(true);
                      startRecording();
                    }}
                  >
                    {({ remainingTime, color }) => (
                      <Typography color={'white'} textAlign={'center'} lineHeight={'1ch'}>
                        Starts in
                        <Typography fontSize={'3rem'} color={color}>
                          {remainingTime}
                        </Typography>
                      </Typography>
                    )}
                  </CountdownCircleTimer>
                </Box>
              )}
              <Grid container
                sx={{
                  '@media (max-width: 500px)': {
                    width: "100%"
                  },
                }}
              >
                <Grid item>{status == 'recording' && <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: '5px', objectFit: 'cover' }} />}</Grid>
                <Grid item>{status == 'stopped' && <video src={mediaBlobUrl as string} autoPlay controls onLoadedMetadata={handleVideoMetadata} style={{ width: '100%', borderRadius: '5px', objectFit: 'cover' }} />}</Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item className='left' xs={12} lg={5}>
            <Typography> Question {question + 1} of {jobQuestions.unanswered_questions.length}</Typography>
            <Typography fontSize={'1.3rem'} fontWeight={'bold'}>
              {jobQuestions.unanswered_questions[question].title}
            </Typography>
            <Typography>{jobQuestions.unanswered_questions[question].description}</Typography>

            <Countdown
              autoStart={false}
              ref={counterRef}
              date={convertTimeStringToDate(jobQuestions.unanswered_questions[question].allowed_time)}
              onComplete={() => {
                stopRecording()
                setShowTime(false)
              }}
              renderer={({ minutes, seconds, total, completed, api }) =>
                showTimer && (
                  <Typography ml={2} display={'inline'} my={1} variant='h6' mt={5}>
                    <p>
                      {''}
                      Remaining Time {minutes}:{seconds}
                    </p>
                  </Typography>
                )
              }
            />

            {started ? (
              status !== 'stopped' ? (
                <Button
                  variant='contained'
                  onClick={() => {
                    counterRef.current.api.stop();
                    setShowTime(false);
                    stopRecording();
                  }}
                  sx={{
                    '@media (max-width: 500px)': {
                      width: "100%"
                    },
                  }}
                >
                  Stop Recording
                </Button>
              ) : (
                <>
                  <Box 
                  sx={{
                    display:"flex",
                    flexDirection:"row",
                    justifyContent:"space-between",
                    width:"100%",
                    '@media (max-width: 500px)': {
                       display:'block',
                       width:"100%",
                    },
                  }}
                  >
                    <Button
                      variant='contained'
                      onClick={handleRetake}
                      sx={{ mr: 2,  width:"100%", 
                     }}
                    >
                      Retake
                    </Button>

                    {jobQuestions.unanswered_questions.length > question + 1 ? (

                      <Button
                        variant='contained'
                        onClick={handleSaveAndContinue}
                        sx={{ mt:1, width:"100%", }}
                      >
                        Save & Continue
                      </Button>

                    )
                      : (
                        <Button
                        sx={{ width:"100%",
                        '@media (max-width: 500px)': {
                          mt:1,
                       },
                       }}
                         variant='contained' onClick={handleSubmit} >
                          Submit
                        </Button>
                      )}
                  </Box>
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
                sx={{
                  '@media (max-width: 500px)': {
                    width: "100%"
                  },
                }}
              >
                Start Recording
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default PageSix
