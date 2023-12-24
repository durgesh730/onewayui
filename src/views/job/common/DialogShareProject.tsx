// ** React Imports
import { Ref, forwardRef, ReactElement, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import ListItemText from '@mui/material/ListItemText'
import DialogContent from '@mui/material/DialogContent'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Add_job_team_member, Retrieve_job_team } from 'src/apiprovider/Job/Job'

interface OptionsType {
  id: number;
  email: string
  avatar: string
  role?: string;
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

interface DialogShareProjectProps {
  teams: any;
  setStore: any
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogShareProject = (props: DialogShareProjectProps) => {
  const [selectedUserIds, setSelectedUserIds] = useState<{ member_id: number }[]>([]);
  const jobId = localStorage.getItem('jobId');

  const admin = props.teams?.admin
  const managers = props.teams?.managers
  const invitees = props.teams?.invitees
  const executives = props.teams?.executives

  const createOption = (id: number, email: string, role?: string): OptionsType => ({
    id,
    avatar: '1.png',
    email,
    role
  });


  const options: OptionsType[] = [];

  if (admin?.id) {
    options.push(createOption(admin.id, admin?.email));
  }

  if (managers) {
    managers.forEach(manager => {
      options.push(createOption(manager.id, manager?.email));
    });
  }

  if (invitees) {
    invitees.forEach(invitee => {
      options.push(createOption(invitee.id, invitee?.email));
    });
  }

  if (executives) {
    executives.forEach(executive => {
      options.push(createOption(executive.id, executive?.email));
    });
  }
  const handleUpdateTeam = () => {
    Retrieve_job_team(jobId)
    .then((data) => {
      props.setStore(data)
    })
    .catch((error) => {
      // console.error(error);
    });
  }

  const handleSubmit = () => {
    if (selectedUserIds.length > 0) {
      // console.log(selectedUserIds)
      Add_job_team_member(jobId, selectedUserIds)
        .then((response) => {
          handleUpdateTeam();
        })
        .catch((error) => {
          // console.error(error);
        });
      setSelectedUserIds([]);
    }

    props.setShow(false)
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
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={() => props.setShow(false)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Share Project
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Share project with a team members</Typography>
          </Box>
          <CustomAutocomplete
            autoHighlight
            sx={{ mb: 6 }}
            id='add-members'
            options={options}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedUserIds(prev => [...prev, { member_id: newValue.id }]);
              }
            }}
            ListboxComponent={List}
            getOptionLabel={option => option.email || ''}
            renderInput={params => (
              <CustomTextField {...params} label='Add Members' placeholder='Add team members...' />
            )}
            renderOption={(props, option) => (
              <ListItem {...props}>
                <ListItemAvatar>
                  <Avatar src={`/images/avatars/${option.avatar}`} alt={option.email} sx={{ height: 28, width: 28 }} />
                </ListItemAvatar>
                <ListItemText primary={option.email} secondary={option.role} />
              </ListItem>
            )}
          />
          <Box
            sx={{
              rowGap: 2,
              columnGap: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <Button variant='contained' onClick={handleSubmit}> Ok</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default DialogShareProject
