// ** MUI Imports
import Box from '@mui/material/Box'

// ** Custom Components Import
import ChatLog from './ChatLog'
import SendMsgForm from './SendMsgForm'


import { fetchComments } from 'src/apiprovider/Job/workflow'
import { useState, useEffect } from 'react'


const Comments = (props) => {
  // ** Props
  const {
    store,
    hidden,
    candidateId,
    sendMsg,
    dispatch,
  } = props

  const renderContent = () => {
    // const selectedChat = store.selectedChat
    const [comments, setComments] = useState([]);

    const updateComments = () => {
      if (candidateId) {
        fetchComments(candidateId)
          .then((data) => { 
            setComments(data);
          })
          .catch((error) => {
            console.error('Error fetching comments:', error)
          });
      } else{
        setComments([]);
      }
    }

    useEffect(() => {
      updateComments();
    }, [candidateId])
    
    const selectedChat = {
      "chat": {
          "id": 1,
          "userId": 1,
          "unseenMsgs": 0,
          "chat": [
              {
                  "message": "How can we help? We're here for you!",
                  "time": "Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)",
                  "senderId": 11,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              },
              {
                  "message": "Hey John, I am looking for the best admin template. Could you please help me to find it out?",
                  "time": "Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)",
                  "senderId": 1,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              },
              {
                  "message": "It should be MUI v5 compatible.",
                  "time": "Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)",
                  "senderId": 1,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              },
              {
                  "message": "Absolutely!",
                  "time": "Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)",
                  "senderId": 11,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              },
              {
                  "message": "This admin template is built with MUI!",
                  "time": "Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)",
                  "senderId": 11,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              },
              {
                  "message": "Looks clean and fresh UI. 😍",
                  "time": "Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)",
                  "senderId": 1,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              },
              {
                  "message": "It's perfect for my next project.",
                  "time": "Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)",
                  "senderId": 1,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              },
              {
                  "message": "How can I purchase it?",
                  "time": "Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)",
                  "senderId": 1,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              },
              {
                  "message": "Thanks, From our official site  😇",
                  "time": "Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)",
                  "senderId": 11,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              },
              {
                  "message": "I will purchase it for sure. 👍",
                  "time": "2023-08-24T07:38:13.819Z",
                  "senderId": 1,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              }
          ]
      },
      "contact": {
          "id": 1,
          "fullName": "Felecia Rower",
          "role": "Frontend Developer",
          "about": "Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing",
          "avatar": "/images/avatars/2.png",
          "status": "offline",
          "chat": {
              "id": 1,
              "unseenMsgs": 0,
              "lastMessage": {
                  "message": "I will purchase it for sure. 👍",
                  "time": "2023-08-24T07:38:13.819Z",
                  "senderId": 1,
                  "feedback": {
                      "isSent": true,
                      "isDelivered": true,
                      "isSeen": true
                  }
              }
          }
      }
  }

    return (
      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          height: "63vh",
          backgroundColor: 'action.hover'
        }}
      >
        {comments.length ? ( <ChatLog hidden={hidden} comments={comments} />) : null}
        <Box sx={{ paddingTop: comments.length? '' : '21rem', }} >
        <SendMsgForm store={store} dispatch={dispatch} sendMsg={sendMsg} candidateId={candidateId} updateComments={updateComments}/>
        </Box>
      </Box>
    )
  }

  return renderContent()
}

export default Comments
