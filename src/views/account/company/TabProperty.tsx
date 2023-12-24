// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import MuiStep, { StepProps } from '@mui/material/Step'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import { Dialog, IconButton, TextField, DialogActions, DialogContent, DialogTitle, } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import StepPersonalDetails from 'src/views/pages/account-settings/property-listing/StepPersonalDetails'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'

const steps = [
  {
    icon: 'tabler:template',
    title: 'Email Teplate',
    subtitle: ''
  },
  {
    icon: 'tabler:bookmarks',
    title: 'Benefit',
    subtitle: ''
  },
  {
    icon: 'tabler:device-mobile-message',
    title: 'Phone Question',
    subtitle: ''
  },
  {
    icon: 'tabler:users-group',
    title: 'Interview Question',
    subtitle: ''
  }
]

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('lg')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  '& .MuiStepLabel-root': {
    paddingTop: 0
  },
  '&:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(2)
  },
  '&:last-of-type .MuiStepLabel-root': {
    paddingBottom: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`
  },
  '& + svg': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled
  },
  '& .MuiStepLabel-label': {
    cursor: 'pointer'
  }
}))

const TabProperty = () => {
  // ** States
  const [activeStep, setActiveStep] = useState<number>(0)
  const [openTemplete, setOpenTemplete] = useState(false)


  // ** Hook
  const theme = useTheme()
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepPersonalDetails />
      case 1:
        return <StepPersonalDetails />
      case 2:
        return <StepPersonalDetails />
      case 3:
        return <StepPersonalDetails />

      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, width:"100%" }}>
      <StepperHeaderContainer sx={{ width: "25%" }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: " .3rem" }}>
            <Button variant='contained' onClick={() => setOpenTemplete(true)} >Add Templete</Button>
          </Box>
        </Box>

        <Step sx={{ '&.Mui-completed + svg': { color: 'primary.main' } }} >
          <StepperWrapper sx={{ height: '100%', paddingTop: "1rem" }} >
            <Stepper
              connector={<></>}
              orientation='vertical'
              activeStep={activeStep}
            >
              {steps.map((step, index) => {
                return (
                  <StepLabel
                    sx={{ width: "100%" }}
                    onClick={() => setActiveStep(index)} >
                    <Typography sx={{
                      backgroundColor: activeStep === index ? theme.palette.primary.main : 'transparent',
                      transition: 'background-color 0.3s ease-in-out',
                      padding: ".3rem .6rem",
                      borderRadius: ".2rem"
                    }} className='step-title'  >
                      <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }} >
                        <Typography sx={{ color: activeStep === index ? 'white' : 'inherit', }} >  {step.title} </Typography>
                        <Box>
                          <IconButton sx={{ color: activeStep === index ? 'white' : 'inherit', }}  >
                            <Icon icon='bx:edit'  onClick={() => setOpenTemplete(true)} />
                          </IconButton>
                          <IconButton sx={{ color: activeStep === index ? 'white' : 'inherit', }}  >
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        </Box>
                      </Box>
                    </Typography>
                  </StepLabel>
                )
              })}
            </Stepper>
          </StepperWrapper>
        </Step>
      </StepperHeaderContainer>

      {openTemplete && (
        <Dialog fullWidth onClose={() => setOpenTemplete(false)} open={openTemplete}>
          <DialogTitle>
            <IconButton
              aria-label='close'
              onClick={() => setOpenTemplete(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Icon icon='bi:x' />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ marginTop: "2rem" }}>
            <TextField fullWidth variant='outlined' label='Title' sx={{ mb: 5 }} name='title' />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenTemplete(false)}>Cancel</Button>
            <Button variant='contained' autoFocus>Submit</Button>
          </DialogActions>
        </Dialog>
      )}

      <CardContent sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
        {renderContent()}
      </CardContent>
    </Card>
  )
}

export default TabProperty
