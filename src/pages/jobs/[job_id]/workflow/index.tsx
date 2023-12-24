import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { StatusObjType, StatusType } from 'src/types/apps/chatTypes'
import { useSettings } from 'src/@core/hooks/useSettings'
import { getInitials } from 'src/@core/utils/get-initials'
import { formatDateToMonthShort } from 'src/@core/utils/format'
import Navbar from 'src/views/job/workflow/Chatnav'
import SidebarLeft from 'src/views/job/workflow/SidebarLeft'
import ChatContent from 'src/views/job/workflow/ChatContent'
import Card from '@mui/material/Card'
import Router from 'next/router'
import { deleteCandidate, listCandidates, listJobs } from 'src/apiprovider/Job/workflow'
import { candidateListType } from 'src/types/candidateList'
import { useRouter } from 'next/router'

const AppChat = () => {
  const router = useRouter();
  const [page, setPage] = useState<Number>(0)
  const [userStatus, setUserStatus] = useState<StatusType>('online')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [userProfileLeftOpen, setUserProfileLeftOpen] = useState<boolean>(false)
  const [userProfileRightOpen, setUserProfileRightOpen] = useState<boolean>(false)

  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const { job_id } = Router.query;
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
  const [defaultJob, setDefaultJob] = useState<object | null>({ workflow: {} })
  const [jobs, setJobs] = useState<object[]>([]);

  const [candidateId, setCandidateID] = useState<string | string[]>(''); 
  const [candidatesList, setCandidatesList] = useState<candidateListType[] | null>([]);

  const handleSetDefaultJob = (foundJob) =>{
    setDefaultJob(foundJob);
  }

  const handleJobList = () =>{
    listJobs()
      .then((data) => {
        setJobs(data);
        const foundJob = data.find((job) => job.id === job_id);
        handleSetDefaultJob(foundJob);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const updateUrlCandidates = (id) => {
    const url = new URL(window.location.href);
    url.searchParams.set('candidate', id);
    window.history.replaceState(null, null, url); 
  }

  const handleCandidateSelection = (id: string) => {
    setCandidateID(id);
    updateUrlCandidates(id)
  };

  const handleUpdateCandidateList = (stage: string) => {
    listCandidates(job_id, stage)
      .then((data) => {
        setCandidatesList(data);
        setCandidateID(data[0]?.id || '');
        updateUrlCandidates(data[0]?.id || '');
        handleJobList();
      }) 
      .catch((error) => {
        console.error(error);
      });
  };

  const backendOptions = ['invited', 'review', 'shortlisted', 'live interview', 'hired', 'rejected']

  useEffect(() => {
    listCandidates(job_id, backendOptions[Number(router.query.stage) || 0])
      .then((data) => {
        setCandidatesList(data);
        if (router.query.candidate){
          setCandidateID(router.query.candidate);
        } else {
          setCandidateID(data[0].id);
          updateUrlCandidates(data[0]?.id || '');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setPage(Number(router.query.stage) || 0);
  }, [job_id]);

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleUserProfileLeftSidebarToggle = () => setUserProfileLeftOpen(!userProfileLeftOpen)
  const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen)
  
  const handleDeleteCandidate = (candidateS) => {
    try {
      const updatedCandidatesList = candidatesList.filter(candidate => candidate.id !== candidateS?.candidate.id);
      setCandidatesList(updatedCandidatesList);
      const newCandidateId = updatedCandidatesList.length > 0 ? updatedCandidatesList[0].id : '';
      setCandidateID(newCandidateId);
      updateUrlCandidates(newCandidateId);
      deleteCandidate(candidateS?.candidate.id, candidateS?.candidate.job);
      
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        '@media (max-width: 1000px)': {
          overflowY: 'scroll'
        }
      }}
    >
      <Navbar 
        page={page} 
        setPage={setPage} 
        handleUpdateCandidateList={handleUpdateCandidateList} 
        handleSetDefaultJob={handleSetDefaultJob}
        handleJobList={handleJobList}
        jobs={jobs}
        defaultJob={defaultJob}
        />

      {page === 0 ?
        <Box
          className='app-chat'
          sx={{
            display: 'flex',
            borderRadius: 1,
            borderStyle: 'none',
            position: 'relative',
            boxShadow: skin === 'bordered' ? 0 : 6,
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }}
        >
          <Card
            sx={{
              marginRight: '20px ',
              borderRadius: 1,
            }}
          >
            <SidebarLeft
              job_id={job_id}
              candidatesList={candidatesList}
              handleCandidateSelection={handleCandidateSelection}
              hidden={hidden}
              mdAbove={mdAbove}
              statusObj={statusObj}
              userStatus={userStatus}
              getInitials={getInitials}
              sidebarWidth={sidebarWidth}
              setUserStatus={setUserStatus}
              leftSidebarOpen={leftSidebarOpen}
              userProfileLeftOpen={userProfileLeftOpen}
              formatDateToMonthShort={formatDateToMonthShort}
              handleLeftSidebarToggle={handleLeftSidebarToggle}
              handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
            />
          </Card>

          <ChatContent
            candidateId={candidateId}
            handleDeleteCandidate={handleDeleteCandidate}
            handleUpdateCandidateList={handleUpdateCandidateList}
            hidden={hidden}
            mdAbove={mdAbove}
            statusObj={statusObj}
            getInitials={getInitials}
            sidebarWidth={sidebarWidth}
            userProfileRightOpen={userProfileRightOpen}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
          />
        </Box>
        : ("")}

      {page === 1 ?
        <Box
          className='app-chat'
          sx={{
            width: '100%',
            display: 'flex',
            borderRadius: 1,
            height: '100%',
            borderStyle: 'none',
            position: 'relative',
            boxShadow: skin === 'bordered' ? 0 : 6,
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }}
        >
          <Card
            sx={{
              marginRight: '20px ',
              borderRadius: 1,
            }}
          >
            <SidebarLeft
              job_id={job_id}
              candidatesList={candidatesList}
              handleCandidateSelection={handleCandidateSelection}
              hidden={hidden}
              mdAbove={mdAbove}
              statusObj={statusObj}
              userStatus={userStatus}
              getInitials={getInitials}
              sidebarWidth={sidebarWidth}
              setUserStatus={setUserStatus}
              leftSidebarOpen={leftSidebarOpen}
              userProfileLeftOpen={userProfileLeftOpen}
              formatDateToMonthShort={formatDateToMonthShort}
              handleLeftSidebarToggle={handleLeftSidebarToggle}
              handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
            />
          </Card>

          <ChatContent
            candidateId={candidateId}
            handleDeleteCandidate={handleDeleteCandidate}
            handleUpdateCandidateList={handleUpdateCandidateList}
            hidden={hidden}
            mdAbove={mdAbove}
            statusObj={statusObj}
            getInitials={getInitials}
            sidebarWidth={sidebarWidth}
            userProfileRightOpen={userProfileRightOpen}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
          />
        </Box>
        : ("")}

      {page === 2 ?
        <Box
          className='app-chat'
          sx={{
            width: '100%',
            display: 'flex',

            borderRadius: 1,
            height: '100%',
            borderStyle: 'none',
            position: 'relative',
            boxShadow: skin === 'bordered' ? 0 : 6,
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }}
        >
          <Card
            sx={{
              marginRight: '20px ',
              borderRadius: 1,
            }}
          >
            <SidebarLeft
              job_id={job_id}
              candidatesList={candidatesList}
              handleCandidateSelection={handleCandidateSelection}
              hidden={hidden}
              mdAbove={mdAbove}
              statusObj={statusObj}
              userStatus={userStatus}
              getInitials={getInitials}
              sidebarWidth={sidebarWidth}
              setUserStatus={setUserStatus}
              leftSidebarOpen={leftSidebarOpen}
              userProfileLeftOpen={userProfileLeftOpen}
              formatDateToMonthShort={formatDateToMonthShort}
              handleLeftSidebarToggle={handleLeftSidebarToggle}
              handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
            />
          </Card>

          <ChatContent
            candidateId={candidateId}
            handleDeleteCandidate={handleDeleteCandidate}
            handleUpdateCandidateList={handleUpdateCandidateList}
            hidden={hidden}
            mdAbove={mdAbove}
            statusObj={statusObj}
            getInitials={getInitials}
            sidebarWidth={sidebarWidth}
            userProfileRightOpen={userProfileRightOpen}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
          />
        </Box>
        : ("")}

      {page === 3 ?
        <Box
          className='app-chat'
          sx={{
            width: '100%',
            display: 'flex',

            borderRadius: 1,
            height: '100%',
            borderStyle: 'none',
            position: 'relative',
            boxShadow: skin === 'bordered' ? 0 : 6,
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }}
        >
          <Card
            sx={{
              marginRight: '20px ',
              borderRadius: 1,
            }}
          >
            <SidebarLeft
              job_id={job_id}
              candidatesList={candidatesList}
              handleCandidateSelection={handleCandidateSelection}
              hidden={hidden}
              mdAbove={mdAbove}
              statusObj={statusObj}
              userStatus={userStatus}
              getInitials={getInitials}
              sidebarWidth={sidebarWidth}
              setUserStatus={setUserStatus}
              leftSidebarOpen={leftSidebarOpen}
              userProfileLeftOpen={userProfileLeftOpen}
              formatDateToMonthShort={formatDateToMonthShort}
              handleLeftSidebarToggle={handleLeftSidebarToggle}
              handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
            />
          </Card>

          <ChatContent
          
            candidateId={candidateId}
            handleDeleteCandidate={handleDeleteCandidate}
            handleUpdateCandidateList={handleUpdateCandidateList}
            hidden={hidden}
            mdAbove={mdAbove}
            statusObj={statusObj}
            getInitials={getInitials}
            sidebarWidth={sidebarWidth}
            userProfileRightOpen={userProfileRightOpen}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
          />
        </Box>
        : ("")}

      {page === 4 ?
        <Box
          className='app-chat'
          sx={{
            width: '100%',
            display: 'flex',

            borderRadius: 1,
            height: '100%',
            borderStyle: 'none',
            position: 'relative',
            boxShadow: skin === 'bordered' ? 0 : 6,
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }}
        >
          <Card
            sx={{
              marginRight: '20px ',
              borderRadius: 1,
            }}
          >
            <SidebarLeft
              job_id={job_id}
              candidatesList={candidatesList}
              handleCandidateSelection={handleCandidateSelection}
              hidden={hidden}
              mdAbove={mdAbove}
              statusObj={statusObj}
              userStatus={userStatus}
              getInitials={getInitials}
              sidebarWidth={sidebarWidth}
              setUserStatus={setUserStatus}
              leftSidebarOpen={leftSidebarOpen}
              userProfileLeftOpen={userProfileLeftOpen}
              formatDateToMonthShort={formatDateToMonthShort}
              handleLeftSidebarToggle={handleLeftSidebarToggle}
              handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
            />
          </Card>

          <ChatContent
          
            candidateId={candidateId}
            handleDeleteCandidate={handleDeleteCandidate}
            handleUpdateCandidateList={handleUpdateCandidateList}
            hidden={hidden}
            mdAbove={mdAbove}
            statusObj={statusObj}
            getInitials={getInitials}
            sidebarWidth={sidebarWidth}
            userProfileRightOpen={userProfileRightOpen}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
          />
        </Box>
        : ("")}

      {page === 5 ?
        <Box
          className='app-chat'
          sx={{
            width: '100%',
            display: 'flex',

            borderRadius: 1,
            height: '100%',
            borderStyle: 'none',
            position: 'relative',
            boxShadow: skin === 'bordered' ? 0 : 6,
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }}
        >
          <Card
            sx={{
              marginRight: '20px ',
              borderRadius: 1,
            }}
          >
            <SidebarLeft
              job_id={job_id}
              candidatesList={candidatesList}
              handleCandidateSelection={handleCandidateSelection}
              hidden={hidden}
              mdAbove={mdAbove}
              statusObj={statusObj}
              userStatus={userStatus}
              getInitials={getInitials}
              sidebarWidth={sidebarWidth}
              setUserStatus={setUserStatus}
              leftSidebarOpen={leftSidebarOpen}
              userProfileLeftOpen={userProfileLeftOpen}
              formatDateToMonthShort={formatDateToMonthShort}
              handleLeftSidebarToggle={handleLeftSidebarToggle}
              handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
            />
          </Card>

          <ChatContent
            candidateId={candidateId}
            handleDeleteCandidate={handleDeleteCandidate}
            handleUpdateCandidateList={handleUpdateCandidateList}
            hidden={hidden}
            mdAbove={mdAbove}
            statusObj={statusObj}
            getInitials={getInitials}
            sidebarWidth={sidebarWidth}
            userProfileRightOpen={userProfileRightOpen}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
          />
        </Box>
        : ("")}
    </Box>
  )
}

AppChat.contentHeightFixed = false

export default AppChat
