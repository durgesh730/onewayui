import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import Menu from '@mui/material/Menu'
import { Box } from '@mui/system'
import { activeJobs } from 'src/apiprovider/dashboard/jobs_view'
import { archiveJob, archiveJobList } from 'src/apiprovider/dashboard/jobs_view'
import Router from "next/router"
import { Direct_invite } from 'src/apiprovider/Job/Job';

type ListItemProps = {
  number: number
  label: string
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ITEM_HEIGHT = 48

const JobCard = () => {


  //handle preview
  const previewJob = (event: React.MouseEvent<HTMLElement>, jobId) => {
    Direct_invite({ job_id: jobId })
      .then((res) => {
        Router.push(res.url);
      })
      .catch((error) => {
        return error
      })
  };

  const editJob = (event: React.MouseEvent<HTMLElement>, jobId) => {
    Router.push(`jobs/${jobId}/edit`);
  };

  const handleInvite = (event: React.MouseEvent<HTMLElement>, jobId) => {
    Router.push(`jobs/${jobId}/edit?activeStep=3`);
  };

  const handleStatusChange = async (event: { target: { value: any } }, id: string) => {
    const selectedStatus = event.target.value;
    try {
      await archiveJob(id, selectedStatus)
        .then(() => {
          Router.reload();
        })

    }
    catch (error) {
      console.log(error)
    };

  };

  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    async function fetchJobData() {
      try {

        const response = await archiveJobList();
        setJobData(response);

      } catch (error) {
        // Handle the error, e.g., show an error message to the user
      }
    }
    fetchJobData();
  }, []);

  const [anchorElArray, setAnchorElArray] = useState<Array<HTMLElement | null>>([]);

  const handleClick2 = (index: number, event: React.MouseEvent<HTMLElement>) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };

  const handleClose2 = (index: number) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };

  const handleRedirect = (jobId: string, stage: number) => {
    Router.push(`/job/workflow/${jobId}?stage=${stage}`)
  }

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'}>
      {
        jobData.map((job, index) => (
          <Card sx={{ padding: '2rem', margin: "1rem", width: { xs: '100%', sm: '100%', lg: '70rem' } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant='h2'
                  mb={0}
                  lineHeight={'2ch'}
                  sx={{
                    fontSize: { xs: '1rem', md: '2rem' },
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  {job.title}
                </Typography>
                <Typography fontSize={'0.8rem'} textAlign={{ xs: 'center', sm: 'left' }}>
                  Total {job.total_candidates} Responded {job.responded_candidates} People ({job.response_percent}%)
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                display={'flex'}
                justifyContent={{ xs: 'center', sm: 'flex-end' }}
                alignItems={'center'}
              >
                <Button variant='contained' sx={{ marginRight: '0.5rem' }} onClick={e => handleInvite(e, job.id)}>
                  Invite Candidate
                </Button>

                <CustomTextField select sx={{ textAlign: 'start' }}
                  defaultValue='archive'
                  onChange={e => handleStatusChange(e, job.id)}
                >
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='archive'>Archive</MenuItem>
                </CustomTextField>
                <IconButton
                  sx={{ ml: 2 }}
                  aria-label='more'
                  aria-controls={`dropdown-menu-2-${index}`}
                  aria-haspopup='true'
                  onClick={(event) => handleClick2(index, event)}
                >
                  <Icon icon='tabler:dots-vertical' />
                </IconButton>

                <Menu
                  keepMounted
                  id={`dropdown-menu-2-${index}`}
                  anchorEl={anchorElArray[index]}
                  onClose={() => handleClose2(index)}
                  open={Boolean(anchorElArray[index])}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5
                    }
                  }}
                >
                  <MenuItem onClick={e => previewJob(e, job.id)}>Preview</MenuItem>
                  <MenuItem onClick={e => editJob(e, job.id)}>Edit</MenuItem>
                </Menu>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3} mt={2} justifyContent='center' textAlign={'center'}>
                  {Object.entries(job.workflow).map(([key, value], count) => (
                    <Grid item md={2} xs={4} key={count}>
                      <Card
                        sx={{
                          height: '100%',
                          px: 3,
                          py: 3,
                          cursor:"pointer",
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1,
                          '&:hover': {
                            backgroundColor: '#F8F7FA',
                          }
                        }}
                        elevation={5}
                        onClick={() => handleRedirect(job.id, count)}
                      >
                        <Typography fontWeight={'bold'}>{value}</Typography>
                        <Typography>{key}</Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid
                item
                mt={3}
                xs={6}
                sm={6}
                sx={{
                  '@media (max-width: 600px)': {
                    fontSize: '0.9rem'
                  }
                }}
              >
                <Typography>{formatDate(job.job_posted_at)} - {formatDate(job.job_expires_at)}</Typography>
              </Grid>
              <Grid
                item
                mt={3}
                xs={6}
                sm={6}
                sx={{
                  textAlign: 'end',
                  '@media (max-width: 600px)': {
                    fontSize: '0.9rem'
                  }
                }}
              >
                <Typography>Created by {job.created_by}</Typography>
              </Grid>
            </Grid>
          </Card>
        ))
      }
    </Box>
  )
}

export default JobCard
