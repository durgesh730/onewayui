import React, { useState, useRef, useEffect, useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { Card } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Review from './Review'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
// import { sendMsg, fetchUserProfile, fetchChatsContacts } from 'src/store/apps/chat'

// // ** Types
// import { RootState, AppDispatch } from 'src/store'
import { StatusObjType } from 'src/types/apps/chatTypes'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'

// ** Chat App Components Imports
import Comments from 'src/views/job/workflow/Comments'
import NoData from './NoData'


type Video = {
  id: number
  thumbnail: string
  title: string
  description: string
  videoUrl: string
  duration: number
}

type Styles = Record<string, React.CSSProperties>

const useStyles = (): Styles => ({
  root: {
    margin: 'auto',
    maxWidth: 800,
    padding: '16px'
  },
  downloadAllButton: {
    marginBottom: '16px'
  },
  videoCard: {
    marginBottom: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  selectedVideo: {
    fontWeight: 'bold'
  }
})

const Interview: React.FC = (candidateData) => {
  const classes = useStyles()
  // const [value, setValue] = useState<string>('1')
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const [answers, setAnswers] = useState<object[] | null>([
    {
      id: 1,
      thumbnail: '/assets/thumb.jpg',
      question: {
        title: 'Question 1',
        description: 'In a world where men are str own ex-husband. Finally, the detectiv agreement.',
      },
      video: '/assets/video1.mp4',
      video_length: 120 // Video duration in seconds
    },
    {
      id: 2,
      thumbnail: '/assets/thumb.jpg',
      question: {
        title: 'Question 2',
        description: 'In a world where men are str own ex-husband. Finally, the detectiv agreement.',
      },
      video: '/assets/video1.mp4',
      video_length: 120 // Video duration in seconds
    }
  ]
  )
  const candidateId = candidateData.candidateData?.candidate.id || ""
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    candidateData.setValue(newValue)
  }

  const videoData: Video[] = useMemo(() => {
    if (!candidateData.candidateData?.answers) {
      return [];
    }
    return candidateData.candidateData?.answers.map((answer, index) => ({
      id: index + 1,
      thumbnail: '/assets/thumb.jpg', // You might want to customize this based on answer data
      title: answer.question.title,
      description: answer.question.description,
      videoUrl: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}${answer.video}` : `${answer.video}`,
      duration: answer.video_length,
    }));
  }, [candidateData]);

  useEffect(() => {
    setSelectedVideo(videoData[0]?.id || null)
  }, [videoData])

  type VideoPlayerProps = {
    videoUrl: string
  }

  const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.load()
      }
    }, [videoUrl])

    const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLVideoElement>) => {
      const videoElement = event.target as HTMLVideoElement
      setVideoDuration(videoElement.duration)
    }

    const handleVideoClick = () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted
        if (videoRef.current.paused) {
          videoRef.current.play()
        } else {
          videoRef.current.pause()
        }
      }
    }

    return (
      <video
        ref={videoRef}
        controls
        style={{ width: '30vw', height: '30vh', borderRadius: '10px' }} // Added border radius
        onClick={handleVideoClick}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src={videoUrl} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    )
  }

  const handleVideoClick = (videoId: number) => {
    const selectedVideo = videoData.find((video: Video) => video.id === videoId)
    if (selectedVideo) {
      setSelectedVideo(videoId)
      setVideoDuration(selectedVideo.duration)
    }
  }

  const handleDownloadAll = () => {
    videoData.forEach((video: Video) => {
      const downloadLink = document.createElement('a')
      downloadLink.href = video.videoUrl
      downloadLink.download = `video_${video.id}.mp4`
      downloadLink.click()
    })
  }

  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [userProfileRightOpen, setUserProfileRightOpen] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  // const dispatch = useDispatch<AppDispatch>()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  // const store = useSelector((state: RootState) => state.chat)

  // ** Vars
  const { skin } = settings
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const sidebarWidth = smAbove ? 360 : 300
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const statusObj: StatusObjType = {
    busy: 'error',
    away: 'warning',
    online: 'success',
    offline: 'secondary'
  }

  // useEffect(() => {
  //   dispatch(fetchUserProfile())
  //   dispatch(fetchChatsContacts())
  // }, [dispatch])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen)


  return (
    <Card className={`${classes.root}`}>
      <TabContext value={candidateData.value}>
        <TabList onChange={handleChange} aria-label='simple tabs example'>
          <Tab value='1' label='Interview' />
          <Tab value='2' label='Comment' />
          <Tab value='3' label='Review' />
        </TabList>
        <TabPanel value='1'>
          {candidateData.candidateData?.answers.length ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '0.8rem',
                      marginTop: '-4vh',
                      marginLeft: '-1vw',
                      alignItems: "center"
                    }}
                  >
                    <CardContent>
                      <Typography style={{ fontSize: '1rem', font: "600" }}>
                        {videoData.find((video: Video) => video.id === selectedVideo)?.title}
                      </Typography>
                      <Typography style={{ fontSize: '0.8rem', width: '80%', paddingTop: "1rem" }}>
                        {videoData.find((video: Video) => video.id === selectedVideo)?.description}
                      </Typography>
                    </CardContent>
                  </div>

                  {selectedVideo && (
                    <div>
                      <h3>Selected Video: {selectedVideo}</h3>
                      <VideoPlayer
                        videoUrl={
                          selectedVideo ? videoData.find((video: Video) => video.id === selectedVideo)?.videoUrl || '' : ''
                        }
                      />
                    </div>
                  )}
                </Grid>
                <Grid item xs={12} sm={5}>
                  <div
                    style={{
                      justifyContent: 'space-between',
                      padding: '0 5px',
                      display: 'flex',
                      marginBottom: '10px'
                    }}
                  >
                    <div>
                      {selectedVideo && <Button variant='text'>{`${selectedVideo} of ${videoData.length} videos`}</Button>}
                    </div>

                    <div>
                      <Button variant='text' onClick={handleDownloadAll}>
                        Download All
                      </Button>
                    </div>

                  </div>

                  <Card
                    sx={{
                      padding: '10px'
                    }}
                    style={{
                      overflowY: 'scroll',
                      height: '50vh'
                    }}
                  >
                    {videoData.map((video: Video, index: number) => (
                      <Grid
                        style={{
                          alignItems: 'center',
                          justifyItems: 'center',
                          justifyContent: 'center'
                        }}
                        item
                        xs={12}
                        sm={12}
                        key={video.id}
                        onClick={() => handleVideoClick(video.id)}
                      >
                        <Card
                          className={`${classes.videoCard}`}
                          style={selectedVideo === video.id ? { background: ' rgb(229, 229, 229)' } : {}}
                        >
                          <div style={{ display: 'flex', marginBottom: '4px', overflow: 'hidden', cursor: "pointer" }}>
                            <CardMedia
                              sx={{
                                width: '80px',
                                aspectRatio: '3 / 4',
                                '@media (max-width: 1000px)': {
                                  width: '80px',
                                  height: '70px',
                                  fontSize: '0.8rem'
                                }
                              }}
                              component='img'
                              alt={video.title}
                              height='90'
                              image={`/images/question/${index + 1}.png`}
                              title={video.title}
                            />
                            <CardContent className={`${classes.videoContent}`}>
                              <Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", gap: "10px" }} >
                                <Typography sx={{ fontSize: ".1rem" }} ><ChatBubbleIcon /></Typography>
                                <Typography> Question {video.id}  </Typography>
                              </Box>
                              <Typography
                                style={{ fontSize: '0.7rem' }}
                                className={`${selectedVideo === video.id ? classes.selectedVideo : ''}`}
                              >
                                {video.title}
                              </Typography>
                            </CardContent>
                          </div>
                        </Card>
                      </Grid>
                    ))}
                  </Card>
                </Grid>
              </Grid>
            </>) : (
            <NoData />
          )}
        </TabPanel>

        <TabPanel value='2'>
          <Box
            className='app-chat'
            sx={{
              width: '100%',
              display: 'flex',
              borderRadius: 1,
              height: "55vh",
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: 'background.paper',
              boxShadow: skin === 'bordered' ? 0 : 6,
              ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
            }}
          >
            <Comments
              hidden={hidden}
              candidateId={candidateId}
              mdAbove={mdAbove}
              statusObj={statusObj}
              getInitials={getInitials}
              sidebarWidth={sidebarWidth}
              userProfileRightOpen={userProfileRightOpen}
              handleLeftSidebarToggle={handleLeftSidebarToggle}
              handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
            />
          </Box>
        </TabPanel>

        <TabPanel value='3'>
          <Box
            className='app-chat'
            sx={{
              width: '100%',
              display: 'flex',
              borderRadius: 1,
              height: "55vh",
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: 'background.paper',
              boxShadow: skin === 'bordered' ? 0 : 6,
              ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
            }}
          >
            <Review
              hidden={hidden}
              candidateId={candidateId}
              mdAbove={mdAbove}
              statusObj={statusObj}
              getInitials={getInitials}
              sidebarWidth={sidebarWidth}
              userProfileRightOpen={userProfileRightOpen}
              handleLeftSidebarToggle={handleLeftSidebarToggle}
              handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
            />
          </Box>
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default Interview
