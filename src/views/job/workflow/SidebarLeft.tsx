// ** React Imports
import { useState, useEffect, ChangeEvent, ReactNode } from 'react'

// ** Next Import
import Router, { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'


// ** Custom Components Import
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Chat App Components Imports
import StarIcon from '@mui/icons-material/Star';
import { formatDate } from 'src/apiprovider/Job/workflow'
import { candidateListType } from 'src/types/candidateList'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}

const SidebarLeft = (props) => {
  // ** Props
  const {
    job_id,
    candidatesList,
    handleCandidateSelection,
    store,
    hidden,
    mdAbove,
    dispatch,
    statusObj,
    selectChat,
    getInitials,
    sidebarWidth,
    leftSidebarOpen,
    removeSelectedChat,
    formatDateToMonthShort,
    handleLeftSidebarToggle,
  } = props

  // ** States
  const [query, setQuery] = useState<string>('')
  const [filteredChat, setFilteredChat] = useState<candidateListType[]>([])
  const [active, setActive] = useState<null | { type: string; id: string | number }>(null);

  // ** Hooks
  const router = useRouter()

  const handleChatClick = (type: 'candidateListType' | 'contact', id: number) => {
    handleCandidateSelection(id)
    setActive({ type, id })
  }


  useEffect(() => {
    if (candidatesList.length && !active) {
      if (router.query.candidate){
        setActive({ type: 'candidateListType', id: router.query.candidate});
      } else {
        setActive({ type: 'candidateListType', id: candidatesList[0].id });
      }
      
    }
  }, [candidatesList, active]);

  const renderChats = () => {
    if (candidatesList) {
      if (query.length && !filteredChat.length) {
        return (
          <ListItem>
            <Typography sx={{ color: 'text.secondary' }}>No Chats Found</Typography>
          </ListItem>
        )
      } else {
        const arrToMap = candidatesList.length && filteredChat.length ? filteredChat : candidatesList
        return arrToMap.map((candidates: candidateListType, index: number) => {
          const activeCondition = active !== null && active.id === candidates.id

          return (
            <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1 } }}>
              <ListItemButton
                disableRipple
                onClick={() => handleChatClick('candidateListType', candidates.id)}
                sx={{
                  py: 2,
                  px: 3,
                  width: '100%',
                  borderRadius: 1,
                  alignItems: 'flex-start',
                  '&.MuiListItemButton-root:hover': { backgroundColor: 'action.hover' },
                  ...(activeCondition && {
                    background: theme =>
                      `linear-gradient(72.47deg, ${theme.palette.primary.main} 22.16%, ${hexToRGBA(
                        theme.palette.primary.main,
                        0.7
                      )} 76.47%) !important`
                  })
                }}
              >
                <ListItemAvatar sx={{ m: 0, alignSelf: 'center' }}>
                  <Badge
                    overlap='circular'
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                  // badgeContent={
                  //   <Box
                  //     component='span'
                  //     // sx={{
                  //     //   width: 8,

                  //     //   height: 8,
                  //     //   borderRadius: '50%',
                  //     //   color: `${statusObj[candidates.status]}.main`,
                  //     //   backgroundColor: `${statusObj[candidates.status]}.main`,
                  //     //   boxShadow: theme =>
                  //     //     `0 0 0 2px ${!activeCondition ? theme.palette.background.paper : theme.palette.common.white
                  //     //     }`
                  //     // }}
                  //   />
                  // }
                  >
                    {candidates.profile_pic ? (
                      <MuiAvatar
                        src={candidates.profile_pic}
                        alt={candidates.first_name}
                        sx={{
                          width: 38,
                          height: 38,
                          outline: theme => `2px solid ${activeCondition ? theme.palette.common.white : 'transparent'}`
                        }}
                      />
                    ) : (
                      <CustomAvatar
                        color="primary"
                        skin={activeCondition ? 'light-static' : 'light'}
                        sx={{
                          width: 38,
                          height: 38,
                          fontSize: theme => theme.typography.body1.fontSize,
                          outline: theme => `2px solid ${activeCondition ? theme.palette.common.white : 'transparent'}`
                        }}
                      >
                        {getInitials(candidates.first_name)}
                      </CustomAvatar>
                    )}
                  </Badge>
                </ListItemAvatar>

                <ListItemText
                  sx={{
                    my: 0,
                    ml: 3,
                    mr: 1.5,
                    '& .MuiTypography-root': { ...(activeCondition && { color: 'common.white' }) }
                  }}
                  primary={
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography noWrap variant='h6'>
                        {candidates.first_name} {candidates.last_name}
                      </Typography>

                      <Typography noWrap variant='h6'>
                        {formatDate(candidates.joined_at)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                      <Typography noWrap sx={{ ...(!activeCondition && { color: 'text.secondary' }), fontSize: ".9rem" }}>
                        via {candidates.via}
                      </Typography>
                      <Typography noWrap sx={{ ...(!activeCondition && { color: 'text.secondary' }), fontSize: ".7rem" }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <StarIcon
                            key={index}
                            sx={{ color: index < candidates?.overall_rating ? 'gold' : 'gray' }} // Set color based on rating
                          />
                        ))}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          )
        })
      }
    }
  }
  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (candidatesList.length) {
      const searchFilterFunction = (candidate: candidateListType) =>
        candidate.first_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        candidate.last_name.toLowerCase().includes(e.target.value.toLowerCase());

      const filteredCandidatesList = candidatesList.filter(searchFilterFunction);
      setFilteredChat(filteredCandidatesList);
    }
  }

  return (
    <div>
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 7,

          height: '100%',
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            width: sidebarWidth,
            position: mdAbove ? 'static' : 'absolute',
            borderTopLeftRadius: theme => theme.shape.borderRadius,
            borderBottomLeftRadius: theme => theme.shape.borderRadius
          },
          '& > .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
            zIndex: theme => theme.zIndex.drawer - 1
          }
        }}
      >
        <Box
          sx={{
            py: 3,
            px: 5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <CustomTextField
            fullWidth
            value={query}
            onChange={handleFilter}
            placeholder='Search for contact...'
            sx={{ '& .MuiInputBase-root': { borderRadius: '30px !important' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start' sx={{ color: 'text.secondary' }}>
                  <Icon fontSize='1.25rem' icon='tabler:search' />
                </InputAdornment>
              )
            }}
          />
          {!mdAbove ? (
            <IconButton sx={{ p: 1, ml: 1 }} onClick={handleLeftSidebarToggle}>
              <Icon icon='tabler:x' />
            </IconButton>
          ) : null}
        </Box>

        <Box sx={{ overflowY:"scroll", height:"67vh"}}>
          <ScrollWrapper hidden={hidden}>
            <Box sx={{ p: theme => theme.spacing(5, 3, 3) }}>
              <List sx={{ mb: 5, p: 0 }}>{renderChats()}</List>
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>
    </div>
  )
}

export default SidebarLeft
