// ** React Imports
import { useRef, useEffect, Ref, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import StarIcon from '@mui/icons-material/Star';

// ** Third Party Components
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types Imports
import {
  ChatLogType,
  MessageType,
  MsgFeedbackType,
  ChatLogChatType,
  MessageGroupType,
} from 'src/types/apps/chatTypes'


const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: Ref<unknown> }>(({ theme }) => ({
  padding: theme.spacing(5)
}))

const ChatLog = (props) => {
  // ** Props
  const { review, hidden } = props
  // ** Ref
  const chatArea = useRef(null)
  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    if (chatArea.current) {
      if (hidden) {
        // @ts-ignore
        chatArea.current.scrollTop = chatArea.current.scrollHeight
      } else {
        // @ts-ignore
        chatArea.current._container.scrollTop = chatArea.current._container.scrollHeight
      }
    }
  }

  const userData = JSON.parse(localStorage.getItem('userData'));

  // ** Formats chat data based on sender
  const formattedChatData = () => {

    const formattedChatLog = []
    let chatMessageSenderId = review[0] ? review[0].evaluator : userData.id
    let msgGroup = {
      senderId: chatMessageSenderId,
      authorFname: review[0] ? review[0].evaluator_info.first_name : userData.first_name,
      authorLname: review[0] ? review[0].evaluator_info.last_name : userData.last_name,
      authorAvatar: review[0] ? review[0].evaluator_info.profile_pic: userData.profile_pic,
      messages: []
    }

    review.forEach((msg, index: number) => {
      if (chatMessageSenderId === msg.evaluator) {
        msgGroup.messages.push({
          time: msg.created_at,
          rating: msg.rating,
          msg: msg.review,
          feedback: {
            "isSent": true,
            "isDelivered": true,
            "isSeen": true
        }
        })
      } else {
        chatMessageSenderId = msg.evaluator

        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.evaluator,
          authorFname: msg.evaluator_info.first_name,
          authorLname: msg.evaluator_info.last_name,
          authorAvatar: msg.evaluator_info.profile_pic,
          
          messages: [
            {
              time: msg.created_at,
              rating: msg.rating,
              msg: msg.review,
              feedback: {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
            }
          ]
        }
      }

      if (index === review.length - 1) formattedChatLog.push(msgGroup)
    })

    return formattedChatLog
  }

  const renderMsgFeedback = (isSender: boolean, feedback: MsgFeedbackType) => {
    if (isSender) {
      if (feedback.isSent && !feedback.isDelivered) {
        return (
          <Box component='span' sx={{ display: 'flex', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
            <Icon icon='tabler:check' fontSize='1.125rem' />
          </Box>
        )
      } else if (feedback.isSent && feedback.isDelivered) {
        return (
          <Box
            component='span'
            sx={{
              display: 'flex',
              '& svg': { mr: 1.5, color: feedback.isSeen ? 'success.main' : 'text.secondary' }
            }}
          >
            <Icon icon='tabler:checks' fontSize='1.125rem' />
          </Box>
        )
      } else {
        return null
      }
    }
  }

  useEffect(() => {
    if (review && review.length) {
      scrollToBottom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [review])

  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item, index: number) => {
      const isSender = item.senderId === userData.id

      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: !isSender ? 'row' : 'row-reverse',
            mb: index !== formattedChatData().length - 1 ? 4 : undefined
          }}
        >
          <div>
     
            <CustomAvatar
              skin='light'
              color={undefined}
              sx={{
                width: 32,
                height: 32,
                ml: isSender ? 3 : undefined,
                mr: !isSender ? 3 : undefined,
                fontSize: theme => theme.typography.body1.fontSize
              }}
              {...(item.authorAvatar && !isSender
                ? {
                  src: item.authorAvatar,
                  alt: item.authorFname
                }
                : {})}
              {...(isSender
                ? {
                  src: userData.profile_pic,
                  alt: userData.first_name
                }
                : {})}
            >
              {item.authorAvatar ? getInitials(item.authorFname) : null}
            </CustomAvatar>
          </div>

          <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
            {item.messages.map((chat, index: number, { length }: { length: number }) => {
              const time = new Date(chat.time)
              
              return (
                <Box key={index} sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
                  {/* Display sender's name above their messages */}
                  {index === 0 && (
                    <Typography
                      variant='body2'
                      sx={{
                        mt: 0,
                        mb: 1,
                        ml: isSender ? 'auto' : undefined,
                        color: isSender ? 'black' : 'text.primary',
                      }}
                    >
                      {item.authorFname} {item.authorLname}
                    </Typography>
                  )}
                  <div>
                    <Typography
                      sx={{
                        boxShadow: 1,
                        borderRadius: 1,
                        maxWidth: '100%',
                        width: 'fit-content',
                        wordWrap: 'break-word',
                        p: (theme) => theme.spacing(2.25, 4),
                        ml: isSender ? 'auto' : undefined,
                        borderTopLeftRadius: !isSender ? 0 : undefined,
                        borderTopRightRadius: isSender ? 0 : undefined,
                        color: isSender ? 'common.white' : 'text.primary',
                        backgroundColor: isSender ? 'primary.main' : 'background.paper',
                      }}
                    >
                        <Typography>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <StarIcon
                            key={index}
                            sx={{ color: index < chat.rating ? 'gold' : 'gray' }} // Set color based on rating
                          />
                        ))}
                        </Typography>
                      {chat.msg}
                    </Typography>
                  </div>
                  {index + 1 === length ? (
                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSender ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {/* {renderMsgFeedback(isSender, chat.feedback)} */}
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        {time
                          ? new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                          : null}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
              )
            })}
          </Box>
        </Box>
      )
    })
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return (
        <Box ref={chatArea} sx={{ p: 5, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      )
    } else {
      return (
        <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false }}>
          {children}
        </PerfectScrollbar>
      )
    }
  }

  return (
    <Box sx={{ height: 'calc(100% - 8.875rem)' }}>
      <ScrollWrapper>{renderChats()}</ScrollWrapper>
    </Box>
  )
}

export default ChatLog
