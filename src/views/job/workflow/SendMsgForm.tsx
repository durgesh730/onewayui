// ** React Imports
import { useState, SyntheticEvent } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { SendMsgComponentType } from 'src/types/apps/chatTypes'
import { createComments } from 'src/apiprovider/Job/workflow'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2.5),
  boxShadow: theme.shadows[1],
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5)
}))

const SendMsgForm = (props) => {
  // ** Props
  const { store, dispatch, sendMsg, candidateId, updateComments } = props

  // ** State
  const [msg, setMsg] = useState<string>('')

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
      const commentData = {
        comment: msg,
        author: userData.id,
        candidate: candidateId
      };
      setMsg("");
      createComments(commentData)
      .then((data) => {
        updateComments();
      })
      
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  }

  return (
    <Form onSubmit={handleSendMsg}>
      <ChatFormWrapper>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', position:"center"}}>
          <CustomTextField
            fullWidth
            value={msg}
            placeholder='Type your message here…'
            onChange={e => setMsg(e.target.value)}
            sx={{
              '& .Mui-focused': { boxShadow: 'none !important' },
              '& .MuiInputBase-input:not(textarea).MuiInputBase-inputSizeSmall': {
                p: theme => theme.spacing(1.875, 2.5)
              },
              '& .MuiInputBase-root': { border: '0 !important' }
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center',}}>
          <Button type='submit' variant='contained'>
            Send
          </Button>
        </Box>
      </ChatFormWrapper>
    </Form>
  )
}

export default SendMsgForm
