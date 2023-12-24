import React, { useState } from 'react'

import { Fragment } from 'react'
import ButtonGroupSplit from './ButtonGroupSplit'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import DialogContentText from '@mui/material/DialogContentText'
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Interview from './Interview'
import StarIcon from '@mui/icons-material/Star';
import CreateIcon from '@mui/icons-material/Create';
import { useEffect } from 'react'
import Fade, { FadeProps } from '@mui/material/Fade'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material'

import * as yup from 'yup'
// ** Store & Actions Imports
import { useDispatch } from 'react-redux'

// ** Types
// import { AppDispatch } from 'src/store'
import { Ref, forwardRef, ReactElement } from 'react'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import CustomTextField from 'src/@core/components/mui/text-field'
import { CardContent } from '@mui/material'
import { Controller } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { parseISO } from 'date-fns';

import { yupResolver } from '@hookform/resolvers/yup'
import { fetchCandidateProfile, resendEmailCandidate, addOverAllRating, createComments, disqualifyCandidate, updateCandidate, extendDeadline } from 'src/apiprovider/Job/workflow'
import { CandidateData } from 'src/types/candidateList'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NoData from './NoData'


// ** Chat App Components Import

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))



const ChatContent = (props) => {
  // ** Props
  const {
    store,
    hidden,
    candidateId,
    handleDeleteCandidate,
    handleUpdateCandidateList,
    mdAbove,
    statusObj,
    getInitials,
    sidebarWidth,
    userProfileRightOpen,
    handleLeftSidebarToggle,
    handleUserProfileRightSidebarToggle
  } = props
  const [openEmail, setOpenEmail] = useState(false)
  const [openEvaluation, setOpenEvaluation] = useState(false)
  const [openComment, setOpenComment] = useState(false)
  const [openDisqulify, setOpenDisqulify] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState({ first_name: '', last_name: '', id: '', job_id: '', email: '', phone_number: '' });
  const handleUpdateModalClose = () => setIsUpdateModalOpen(false)
  const [isShown, setIsShown] = useState(false);
  const [candidateS, setCandidateS] = useState<CandidateData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tabValue, setTabValue] = useState<string>('1')


  const updateCandidateDetails = () => {
    fetchCandidateProfile(candidateId)
      .then((data) => {
        setCandidateS(data);
        setSelectedDate(parseISO(data.candidate.job_deadline))
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const [openEdit, setOpenEdit] = useState(false)


  const handleResendEmail = (candidate_id) => {
    resendEmailCandidate(candidate_id)
    setOpenEmail(false)
  };


  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleOpenEvaluation = () => {
    setOpenEvaluation(true);
  };

  const handleCloseEvaluation = () => {
    setOpenEvaluation(false);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleEvaluationSubmit = () => {
    addOverAllRating(candidateId, rating, comment)
      .then(() => {
        setRating(0);
        setComment("");
        updateCandidateDetails();
      });
    handleCloseEvaluation();
    setTabValue("3")
  };

  const handDelCandidate = () => {
    handleDeleteCandidate(candidateS)
    setOpenDelete(false);
  }

  const handleDisqualifyCandidate = async () => {
    try {
      disqualifyCandidate(candidateId)
        .then(async (data) => {
          handleUpdateCandidateList(candidateS.candidate.stage)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleExtendDeadline = () => {
    // Call the provided extendDeadlineFunction with the candidate_id and selectedDate
    const candidate_id = candidateId;
    const expiry_date = selectedDate.toISOString(); // Convert date to ISO format
    extendDeadline(candidate_id, expiry_date);

    // Close the dialog
    setOpenDisqulify(false);
  };


  const [commentText, setCommentText] = useState('');

  const handleCommentTextChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const data = {
      "comment": commentText,
      "author": userData.id,
      "candidate": candidateId
    }

    createComments(data)
      .then(() => {
        setCommentText("");
      });
    setOpenComment(false);
    setTabValue("2")
  };

  useEffect(() => {
    updateCandidateDetails();
  }, [candidateId])

  // const dispatch = useDispatch<AppDispatch>()

  // Define the showErrors function
  const showErrors = (field: string, valueLen: number, min: number) => {
    if (valueLen === 0) {
      return `${field} field is required`;
    } else if (valueLen > 0 && valueLen < min) {
      return `${field} must be at least ${min} characters`;
    } else {
      return '';
    }
  };

  const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    last_name: yup.string().min(3, 'Last name must be at least 3 characters').required('Last name is required'),
    phone_number: yup.string().notRequired(),
    first_name: yup.string().min(3, 'First name must be at least 3 characters').required('First name is required')
  });


  const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
  ) {
    return <Fade ref={ref} {...props} />
  })

  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  // Autofill the form with candidateS data
  React.useEffect(() => {
    setValue('first_name', candidateS?.candidate.first_name);
    setValue('last_name', candidateS?.candidate.last_name);
    setValue('email', candidateS?.candidate.email);
    setValue('phone_number', candidateS?.candidate.phone_number);
  }, [setValue, candidateS]);

  const onSubmit = async (formData) => {
    try {
      await updateCandidate(candidateS.candidate.id, candidateS.candidate.job, formData)
        .then((data) => {
          handleUpdateCandidateList(candidateS.candidate.stage)
          updateCandidateDetails();
        });
      setOpenEdit(false)
    } catch (error) {
      console.error('Error updating candidate details:', error);
    }
  };

  const renderContent = () => {
    // const selectedChat = store.selectedChat
    return (

      <Box
        sx={{
          width: 0,

          flexGrow: 1,
          height: '100%',
          backgroundColor: 'action.hover'
        }}
      >

        {candidateId ? (
          <>
            <Box
              sx={{
                px: 5,
                py: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'background.paper',
                borderBottom: theme => `1px solid ${theme.palette.divider}`
              }}
            >

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {mdAbove ? null : (
                  <IconButton onClick={handleLeftSidebarToggle} sx={{ mr: 2 }}>
                    <Icon icon='tabler:menu-2' />
                  </IconButton>
                )}
                <Box

                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <Box onClick={() => setOpenEdit(true)} sx={{ marginLeft: "-20px", marginTop: "-28px", paddingRight: "1rem" }} >
                    <CreateIcon sx={{ backgroundColor: "rgb(115,103,240)", color: "white", padding: ".3rem", borderRadius: ".3rem", fontSize: "1.7rem" }} />
                  </Box>
                  <Badge
                    overlap='circular'
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                    sx={{ mr: 3 }}
                    badgeContent={
                      <Box
                        component='span'
                      />
                    }
                  >

                    {candidateS?.candidate.profile_pic ? (
                      <MuiAvatar
                        sx={{ width: 38, height: 38 }}
                        src={`${candidateS?.candidate.profile_pic}`}
                        alt={candidateS?.candidate.first_name}
                      />
                    ) : (
                      <CustomAvatar
                        skin='light'
                        sx={{
                          width: 38,
                          height: 38,
                          fontSize: theme => theme.typography.body1.fontSize,
                          '@media (max-width: 600px)': {
                            fontSize: '0.5rem'
                          }
                        }}
                      >
                        {getInitials(candidateS?.candidate?.first_name)}
                      </CustomAvatar>
                    )}
                  </Badge>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ display: "flex", alignItems: "center", gap: ".7rem" }} variant='h6'>{candidateS?.candidate?.first_name} {candidateS?.candidate?.last_name}
                      <Typography
                        sx={{
                          color: 'text.disabled',
                          '@media (max-width: 600px)': {
                            fontSize: '0.5rem'
                          }
                        }}
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <StarIcon
                            key={index}
                            sx={{ color: index < candidateS?.candidate?.overall_rating ? 'gold' : 'gray' }} // Set color based on rating
                          />
                        ))}
                      </Typography>
                    </Typography>

                    <Typography variant='h6'>{candidateS?.candidate?.email}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '@media (max-width: 600px)': {
                    overflowX: 'scroll'
                  }
                }}
              >
                <Fragment>
                  <IconButton onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)} onClick={() => setOpenEmail(true)} size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='material-symbols:mail' />
                  </IconButton>

                  <IconButton onClick={() => setOpenComment(true)} size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='gridicons:chat' />
                  </IconButton>

                  <IconButton onClick={() => setOpenEvaluation(true)} size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='tabler:thumb-up' />
                  </IconButton>
                  <IconButton onClick={() => setOpenDisqulify(true)} size='small' sx={{ color: 'text.secondary' }}>
                    {/* <Icon icon='tabler:hand-stop' /> */}
                    <CalendarMonthIcon />
                  </IconButton>
                  <IconButton onClick={() => setOpenDelete(true)} size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='tabler:trash' />
                  </IconButton>
                </Fragment>

                {candidateS?.candidate.stage !== 'rejected' && (
                  <Button
                    variant="contained"
                    sx={{ marginRight: '.2rem', paddingTop: '.7rem', paddingBottom: '.7rem' }}
                    color="error"
                    onClick={handleDisqualifyCandidate}
                  >
                    Reject
                  </Button>
                )}
                <ButtonGroupSplit id={candidateS?.candidate.id} candidateStage={candidateS?.candidate.stage} handleUpdateCandidateList={handleUpdateCandidateList} />
              </Box>
            </Box>

            <Box>
              <Interview candidateData={candidateS} value={tabValue} setValue={setTabValue} />
            </Box>

            {openEdit && (
              <Dialog onClose={() => setOpenEdit(false)} open={openEdit}>
                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                  }}
                >
                  {/* <CustomCloseButton onClick={() => setIsUpdateModalOpen(false)}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton> */}
                  <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant='h3' sx={{ mb: 3 }}>
                      Edit Candidate Information
                    </Typography>
                  </Box>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Grid container spacing={5}>
                        <Grid item xs={12}>
                          <Controller
                            name='first_name'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <CustomTextField
                                fullWidth
                                value={value}
                                label='First Name'
                                onChange={onChange}
                                placeholder='Leonard'
                                error={Boolean(errors.first_name)}
                                aria-describedby='validation-schema-first-name'
                                {...(errors.first_name && { helperText: errors.first_name.message })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name='last_name'
                            control={control}
                            rules={{ required: true }}
                            defaultValue='hello'

                            render={({ field: { value, onChange } }) => (
                              <CustomTextField
                                fullWidth
                                value={value}
                                label='Last Name'
                                onChange={onChange}
                                placeholder='Carter'
                                error={Boolean(errors.last_name)}
                                aria-describedby='validation-schema-last-name'
                                {...(errors.last_name && { helperText: errors.last_name.message })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name='email'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <CustomTextField
                                fullWidth
                                type='email'
                                value={value}
                                label='Email'
                                onChange={onChange}
                                error={Boolean(errors.email)}
                                placeholder='carterleonard@gmail.com'
                                aria-describedby='validation-schema-email'
                                {...(errors.email && { helperText: errors.email.message })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name='phone_number'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <CustomTextField
                                fullWidth
                                type='phone'
                                value={value}
                                label='Mobile no.'
                                onChange={onChange}
                                error={Boolean(errors.phone_number)}
                                placeholder='+91 9876543210'
                                aria-describedby='validation-schema-email'
                                {...(errors.phone_number && { helperText: errors.phone_number.message })}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', mt: '6px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                          <Button variant='contained' type='submit'>
                            Submit
                          </Button>
                          <Button variant='tonal' color='secondary' onClick={() => setOpenEdit(false)}>
                            Discard
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </CardContent>
                </DialogContent>
              </Dialog>
            )}

            {openEmail && (
              <Dialog onClose={() => setOpenEmail(false)} open={openEmail}>
                <DialogTitle>
                  Resend Invite
                  <IconButton
                    aria-label='close'
                    onClick={() => setOpenEmail(false)}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <Icon icon='bi:x' />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Do you want to resend Invite to Candidate?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenEmail(false)}>Cancel</Button>
                  <Button onClick={() => { handleResendEmail(candidateId); setEmailSuccess(true) }} color='primary' autoFocus>
                    Send
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {emailSuccess && (
              <Dialog fullWidth onClose={() => setEmailSuccess(false)} open={emailSuccess}>
                <DialogTitle>
                  {/* Delete */}
                  <IconButton
                    aria-label='close'
                    onClick={() => setEmailSuccess(false)}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <Icon icon='bi:x' />
                  </IconButton>
                </DialogTitle>

                <DialogContent sx={{ textAlign: "center" }} >Your Email Send Successfully</DialogContent>

                <DialogActions>
                  <Button onClick={() => setEmailSuccess(false)}>Cancel</Button>
                  {/* <Button onClick={handleDeleteCandidate} color='primary' autoFocus>
                Delete
              </Button> */}
                </DialogActions>
              </Dialog>
            )}

            {openEvaluation && (
              <Dialog fullWidth onClose={handleCloseEvaluation} open={openEvaluation}>
                <DialogTitle>
                  Rating
                  <IconButton
                    aria-label='close'
                    onClick={handleCloseEvaluation}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <Icon icon='bi:x' />
                  </IconButton>
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", cursor: "pointer" }} >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon
                      key={index}
                      onClick={() => handleRatingChange(index + 1)}
                      sx={{ color: index < rating ? 'gold' : 'gray' }} // Set color based on rating
                    />
                  ))}
                  <br />
                  <CustomTextField
                    fullWidth
                    rows={5}
                    multiline
                    label='Comment'
                    value={comment}
                    onChange={handleCommentChange}
                    id='textarea-outlined-static'
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseEvaluation}>Cancel</Button>
                  <Button onClick={handleEvaluationSubmit} color='primary' autoFocus>
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {openComment && (
              <Dialog fullWidth onClose={() => setOpenComment(false)} open={openComment}>
                <DialogTitle>
                  Comment
                  <IconButton
                    aria-label='close'
                    onClick={() => setOpenComment(false)}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <Icon icon='bi:x' />
                  </IconButton>
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", cursor: "pointer" }} >
                  <CustomTextField
                    fullWidth
                    rows={5}
                    multiline
                    label='Add Your Comment Here'
                    value={commentText}
                    onChange={handleCommentTextChange}
                    id='textarea-outlined-static'
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenComment(false)}>Cancel</Button>
                  <Button onClick={handleCommentSubmit} color='primary' autoFocus>
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {openDisqulify && (
              <Dialog onClose={() => setOpenDisqulify(false)} open={openDisqulify}>
                <DialogTitle>
                  Extend Deadline
                  <IconButton
                    aria-label='close'
                    onClick={() => setOpenDisqulify(false)}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <Icon icon='bi:x' />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar onSelectDate={(date) => setSelectedDate(date)} />
                  </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDisqulify(false)}>Cancel</Button>
                  <Button onClick={handleExtendDeadline} color='primary' autoFocus>
                    Extend Deadline
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {openDelete && (
              <Dialog fullWidth onClose={() => setOpenDelete(false)} open={openDelete}>
                <DialogTitle>
                  Delete
                  <IconButton
                    aria-label='close'
                    onClick={() => setOpenDelete(false)}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <Icon icon='bi:x' />
                  </IconButton>
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center" }} > Are you sure to delete this candidate</DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                  <Button onClick={handDelCandidate} color='primary' autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            )}

          </>) : (
          <NoData />
        )}
      </Box>
    )
  }

  return renderContent()
}

export default ChatContent
