import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import CustomTextField from 'src/@core/components/mui/text-field'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import React, { useState, ReactNode, useEffect } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'
import { listJobs } from 'src/apiprovider/Job/workflow'
import Router, { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react';

type MyComponentProps = {
  setPage: Dispatch<SetStateAction<number>>;
  page: Number;
  handleUpdateCandidateList: Dispatch<SetStateAction<string>>;
  handleSetDefaultJob: Dispatch<SetStateAction<object>>;
  handleJobList: Function;
  jobs: object[];
  defaultJob: object;
};

const Navbar: React.FC<MyComponentProps> = ({ 
    setPage, 
    page, 
    handleUpdateCandidateList, 
    handleSetDefaultJob,
    handleJobList,
    jobs,
    defaultJob
}) => {
  const navbarStyle = { marginBottom: '10px' }
  const buttonStyle = { marginLeft: 2 }
  const { job_id } = Router.query;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    handleJobList();
  }, [page]);

  useEffect(() => {
    const foundJob = jobs.find((job) => job.id === job_id);
    if (foundJob) {
      handleSetDefaultJob(foundJob);
    }
  }, [job_id, jobs]);


  const router = useRouter();

  const redirectToInvite = () => {
    router.push(`/jobs/${job_id}/edit?activeStep=3`);
  };

  const redirectToEdit = () => {
    router.push(`/jobs/${job_id}/edit/`);
  };

  const redirectToNewJob = (jobId) => {
    router.push(`/jobs/${jobId}/workflow/`);
  };

  const changePage = (num: number, stage: string) => {
    setPage(num);
    handleUpdateCandidateList(stage);
  };

  return (
    <Box mb={2} className='content-center'>
      <Card
        sx={{
          p: 5,
          pb: 0,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Grid container className='chatnavcontainer'>
          <Grid item xs={6} sm={3} className='chatnavgrid'>
            <CustomTextField
              color='secondary'
              select
              fullWidth
              defaultValue={job_id}
              sx={{
                mr: 4,
                mb: 2,
                '@media (max-width: 800px)': {
                  fontSize: '0.6rem',
                  color: 'red',
                  margin: '0px',
                  padding: '0px'
                }
              }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected: unknown) => {
                  if (typeof selected === 'string' && selected.length === 0) {
                    return 'Actions';
                  }
                  const selectedJob = jobs.find((job) => job.id === selected);
                  if (selectedJob) {
                    return selectedJob.title;
                  }
                  return defaultJob ? defaultJob.title : '';
                }
              }}
              onChange={(event) => redirectToNewJob(event.target.value)}
            >
              {jobs.map((job) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.title}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
          <Grid item xs={6} sm={9} style={{ textAlign: 'end' }} className='chatnavgrid'>
            <Button variant='contained' color='primary' style={buttonStyle} onClick={redirectToInvite}>
              Invite Candidate
            </Button>
            <Button variant='contained' sx={{ marginLeft: '20px' }} color='primary' style={buttonStyle} onClick={redirectToEdit}>
              Edit Job
            </Button>
          </Grid>

          <Grid item xs={14}>
            <Toolbar style={{ justifyContent: 'center' }}>
              <Box className='nav chatnav flex-column flex-sm-row'>
                <Typography
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'wrap',
                    gap: '60px',
                    cursor: "pointer",
                    '@media (max-width: 800px)': {
                      gap: '1px',
                      fontSize: '0.6rem',
                      justifyContent: 'center'
                    }
                  }}
                >
                  <Typography onClick={() => changePage(0, "invited")}
                    sx={{
                      backgroundColor: page === 0 ? 'rgb(115,103,240)' : 'transparent',
                      color: page === 0 ? "white" : "black",
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      paddingTop: '.4rem',
                      paddingBottom: '.4rem',
                      borderRadius: ".3rem"
                    }}
                  > Invite {defaultJob.workflow.invited} </Typography>

                  <Typography onClick={() => changePage(1, "review")}
                    sx={{
                      backgroundColor: page === 1 ? 'rgb(115,103,240)' : 'transparent',
                      color: page === 1 ? "white" : "black",
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      paddingTop: '.4rem',
                      paddingBottom: '.4rem',
                      borderRadius: ".3rem"
                    }}> Review {defaultJob.workflow.review}</Typography>

                  <Typography onClick={() => changePage(2, "shortlisted")}
                    sx={{
                      backgroundColor: page === 2 ? 'rgb(115,103,240)' : 'transparent',
                      color: page === 2 ? "white" : "black",
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      paddingTop: '.4rem',
                      paddingBottom: '.4rem',
                      borderRadius: ".3rem"
                    }}> Shortlist {defaultJob.workflow.shortlisted}</Typography>

                  <Typography onClick={() => changePage(3, "live interview")} sx={{
                    backgroundColor: page === 3 ? 'rgb(115,103,240)' : 'transparent',
                    color: page === 3 ? "white" : "black",
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    paddingTop: '.4rem',
                    paddingBottom: '.4rem',
                    borderRadius: ".3rem"
                  }}> Interview {defaultJob.workflow['live interview']} </Typography>

                  <Typography onClick={() => changePage(4, "hired") } sx={{
                    backgroundColor: page === 4 ? 'rgb(115,103,240)' : 'transparent',
                    color: page === 4 ? "white" : "black",
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    paddingTop: '.4rem',
                    paddingBottom: '.4rem',
                    borderRadius: ".3rem"
                  }}> Hired {defaultJob.workflow.hired}</Typography>

                  <Typography onClick={() => changePage(5, "rejected")} sx={{
                    backgroundColor: page === 5 ? 'rgb(115,103,240)' : 'transparent',
                    color: page === 5 ? "white" : "black",
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    paddingTop: '.4rem',
                    paddingBottom: '.4rem',
                    borderRadius: ".3rem"
                  }}> Rejected {defaultJob.workflow.rejected}</Typography>
                </Typography>

              </Box>
            </Toolbar>
          </Grid>

        </Grid>
        <AppBar
          position='static'
          sx={{
            backgroundColor: 'background.paper'
          }}
          style={navbarStyle}
        ></AppBar>
      </Card>

    </Box>
  )
}

Navbar.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Navbar
