// ** React Imports
import { Ref, forwardRef, ReactElement } from 'react'
import { useRouter } from 'next/dist/client/router'
// ** MUI Imports
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogActions from '@mui/material/DialogActions'
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp'

// ** Icon Imports
import { Grid } from '@mui/material'
import { Box} from '@mui/system'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
  ) {
    return <Fade ref={ref} {...props} />
  })
  
  interface DialogEditUserInfoProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const DialogEditUserInfo = (props: DialogEditUserInfoProps) => {
  const router =  useRouter()
  
  const hanldebothEvent = () => {
    props.setShow(false)
    router.push('/dashboard')
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={props.show}
        maxWidth='md'
        scroll='body'
        onClose={() => props.setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => props.setShow(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <Box
          textAlign={'center'}
          padding={'2rem'}
        >
          <Grid>
            <CheckCircleOutlineSharpIcon sx={{ fontSize: "5rem" }} />
          </Grid>
          <Typography sx={{ fontSize: "2rem" }} >Candidate Invited Successufully</Typography>
        </Box>

        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 1 }} onClick={() => hanldebothEvent()}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogEditUserInfo
