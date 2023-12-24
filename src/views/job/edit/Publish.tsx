import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import clipboardCopy from 'clipboard-copy';
import { Bulk_upload_candidate, Create_candidate, Direct_invite } from 'src/apiprovider/Job/Job';
import DialogEditUserInfo from 'src/views/utils/DialogEditUserInfo';
import Router from "next/router"
import FileUploaderRestrictions from '../create/Uploader';

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const Publish = ({ setActive }: any) => {
  const [show, setShow] = useState<boolean>(false)
  const [url, setUrl] = useState('')
  const [open, setOpen] = useState(false)
  const { job_id } = Router.query;

  const [candidates, setCandidate] = useState([
    {
      job: job_id,
      first_name: "",
      last_name: '',
      email: ""
    },
    {
      job: job_id,
      first_name: "",
      last_name: '',
      email: ""
    },
    {
      job: job_id,
      first_name: "",
      last_name: '',
      email: ""
    }
  ])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleCopyClick = () => {
    clipboardCopy(url)
      .then(() => {
        alert('Text copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy text:', error); 
      });
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [value, setValue] = React.useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const [fileList, setFiles] = useState([])
  const fileinp = useRef<any>()


  const handleDrop = (e: any) => {
    e.preventDefault()
    e.target.classList.remove('drag-enter')
    var files = e.dataTransfer.files
    setFiles([...files])
  }

  const handleFileChange = (e: any) => {
    if (!e.target.files) {
      return
    }
    const files = [...e.target.files]
    setFiles(files)
  }


  const handleTeams = (e: any, idx: number) => {
    const { name, value } = e.target;

    let tempQuestions = [...candidates];

    tempQuestions[idx] = {
      ...tempQuestions[idx],
      [name]: value
    };

    setCandidate(tempQuestions);
  };

  const addCandidate = () => {
    setCandidate((prev: any) => [
      ...prev,
      { first_name: "", last_name: "", email: "", job: job_id, }
    ])
  }

  const removeCandidate = (idx: number) => {
    setCandidate(prev => {
      const updatedQuestions = [...prev]
      updatedQuestions.splice(idx, 1)
      return updatedQuestions
    })
  }

  const handleInviteCandidate = () => {
    for (let index = 0; index < candidates.length; index++) {
      const element = candidates[index];
      if (element.first_name !== '' || element.last_name !== '' || element.email !== '') {
        Create_candidate(element)
          .then((res) => {
            setShow(true)
          })
          .catch((error) => {
            return error
          })
      }
    }
  }

  const InviteCandidate = () => {
    if (!fileList || fileList.length === 0) {
      console.error('No files selected');
      return;
    } else {
      const formData = new FormData();
      formData.append('file', fileList[0]);

      Bulk_upload_candidate(job_id, formData)
        .then((res) => {
          handleClose()
        })
        .catch((error) => {
          console.error('Error uploading:', error);
        });
    }
  }

  const maxLength = 45
  const displayString = url.length > maxLength ? `${url.slice(0, maxLength)}...` : url;

  useEffect(() => {
    Direct_invite({"job_id" : job_id })
      .then((res) => {
        setUrl(`${window.location.origin}${res.url}`)
      })
      .catch((error) => {
        return error
      })
  }, [])

  return (
    <>

      <Box sx={{ width: { xs: '100%', sm: '35rem', md: '50rem' } }}>
        <Card sx={{ p: 7 }}>
          <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} mb={1} paddingRight={'31%'} >
            <Typography>Invite via Direct Link</Typography>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={5}>
            <Typography fontWeight={'bold'}>Candidate Information</Typography>
            <Box
              display={'flex'}
              alignItems={'center'}
              bgcolor={'#d6d6d63a'}
              p={1}
              px={3}
              justifyContent={'space-between'}
              borderRadius={1}
            >
              <Typography >{displayString} </Typography>
              <IconButton onClick={handleCopyClick} >
                <Icon icon={'tabler:copy'} />
              </IconButton>
            </Box>
          </Box>

          {candidates.map((item, idx) => (
            <>
              <Box key={idx+1} sx={{ display: 'flex', p: 0, m: 0 }} width={'100%'} >
                <Box width={'100%'}>
                  <Box display={'flex'} justifyContent={'flex-end'} p={3} gap={3} color={'primary.main'}>
                    <Icon icon='material-symbols:close' style={{ cursor: 'pointer' }} onClick={() => { removeCandidate(idx) }} />
                  </Box>
                </Box>
              </Box>
              <Grid  key={idx} container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label='First Name' name='first_name' value={item.first_name} onChange={e => handleTeams(e, idx)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label='Last Name' name='last_name' value={item.last_name} onChange={e => handleTeams(e, idx)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label='Email' name='email' value={item.email} onChange={e => handleTeams(e, idx)} />
                </Grid>
              </Grid>
            </>
          ))}

          <Card
            sx={{ border: '1px dashed blue', borderColor: 'primary.main', mt: 5, cursor: 'pointer ', marginBottom: '1rem' }}
            onClick={() => addCandidate()}
          >
            <Typography p={3} width={'100%'} color='primary.main'>
              + Add Candidate
            </Typography>
          </Card>
          {/* </Box> */}

          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Button fullWidth variant='contained' onClick={handleInviteCandidate} >
                Invite Candidate
              </Button>
            </Grid>
            <Grid item xs={6} md={5}>
              <Button onClick={() => handleClickOpen()}>Or import from a file</Button>
            </Grid>
          </Grid>
        </Card>
        <Dialog
          open={open}
          onClose={() => handleClose()}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, totam! Dolorem, soluta ipsa. Placeat,
              sequi eos consequatur ullam adipisci officiis. Recusandae quasi exercitationem tempore, eaque officiis nisi
              officia animi excepturi.
            </DialogContentText>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 5 }}>
              <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                <Tab label='Bulk Invite' />
                <Tab label='Direct Link' />
              </Tabs>
            </Box>


            <CustomTabPanel value={value} index={0}>
              <Box mt={4} borderRadius={1} bgcolor={'#E8EBF3'} padding={'1rem'}>
                <FileUploaderRestrictions/>
              </Box>
            </CustomTabPanel>


            <CustomTabPanel value={value} index={1}>
              <Box
                display={'flex'}
                alignItems={'center'}
                border={'1px solid blue'}
                p={2}
                px={3}
                justifyContent={'space-between'}
                borderRadius={1}
              >
                <Typography>{displayString}</Typography>
                <IconButton onClick={handleCopyClick} >
                  <Icon icon={'tabler:copy'} />
                </IconButton>
              </Box>
            </CustomTabPanel>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()} color='error'>
              Cancel
            </Button>
            <Button autoFocus onClick={InviteCandidate} >Invite</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* invite candidate success pop Up */}
      <DialogEditUserInfo show={show} setShow={setShow} />

    </>
  )
}

export default Publish
