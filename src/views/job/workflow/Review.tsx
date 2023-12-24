// ** MUI Imports
import Box from '@mui/material/Box'

// ** Custom Components Import
import ReviewRate from './ReviewRate'
import SendMsgForm from './SendMsgForm'


import { fetchEval } from 'src/apiprovider/Job/workflow'
import { useState, useEffect } from 'react'

const ChatContent = (props) => {
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
    const [review, setReview] = useState([]);

    useEffect(() => {
      if (candidateId) {
        fetchEval(candidateId)
          .then((data) => { 
            setReview(data);
          })
          .catch((error) => {
            console.error('Error fetching comments:', error)
          });
      } else{
        setReview([]);
      }
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
          width: 0,
          flexGrow: 1,
          height: "70vh",
          backgroundColor: 'action.hover'
        }}
      >
        {review && review.length ? (
          <ReviewRate hidden={hidden} review={review}/>
        ) : null}
      </Box>
    )
  }

  return renderContent()
}

export default ChatContent
