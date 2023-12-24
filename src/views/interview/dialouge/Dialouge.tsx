import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function AlertDialogSlide({ open, setOpen, agree }) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>Start Interview</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            Practice is over. You want to start the actual interview?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='error' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              handleClose()
              agree()
            }}
          >
            Start Interview
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
