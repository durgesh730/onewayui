import { Button, Grid } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { saveAs } from 'file-saver'

import { ReactMediaRecorder, useReactMediaRecorder } from 'react-media-recorder'

const RecordView = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } = useReactMediaRecorder({
    video: true
  })

  const [blobs, setBlobs] = useState<string[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream
    }
  }, [previewStream])

  const handleSaveVideo = () => {
    saveAs(mediaBlobUrl as string, 'download.mp4')
  }

  function addVideo() {
    setBlobs(prev => [...prev, mediaBlobUrl as string])
  }


  return (
    <Grid container spacing={2}>
      <Grid item>{status == 'idle' && <video ref={videoRef} autoPlay controls />}</Grid>
      <Grid item>{status == 'recording' && <video ref={videoRef} autoPlay controls />}</Grid>
      <Grid item>{status == 'stopped' && <video src={mediaBlobUrl as string} autoPlay controls />}</Grid>

      <Grid item>
        <p>{status}</p>
        <Button variant='contained' onClick={startRecording}>
          Start Recording
        </Button>
        <Button variant='contained' onClick={stopRecording}>
          Stop Recording
        </Button>
        <Button onClick={addVideo}>Save Video</Button>
      </Grid>
    </Grid>
  )
}

export default RecordView
