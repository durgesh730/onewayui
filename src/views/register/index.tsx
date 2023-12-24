// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { Theme, styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiStep, { StepProps } from '@mui/material/Step'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// // ** Step Components
// import StepPersonalInfo from 'src/views/pages/auth/register-multi-steps/StepPersonalInfo'
// import StepAccountDetails from 'src/views/pages/auth/register-multi-steps/StepAccountDetails'
// import StepBillingDetails from 'src/views/pages/auth/register-multi-steps/StepBillingDetails'
import AccountType from 'src/views/register/AccountType'
import CompanyDetails from 'src/views/register/CompanyDetails'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'

import api from 'src/apiprovider/baseApi'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { Alert } from '@mui/material'
import authConfig from 'src/configs/auth'

const steps = [
  {
    title: 'Account',
    icon: 'ic:round-account-box',
    subtitle: 'Account Type'
  },
  {
    title: 'Company',
    icon: 'ooui:view-details-ltr',
    subtitle: 'Company Informations'
  }
]

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  padding: 0,
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
  '&.Mui-completed + svg': {
    color: theme.palette.primary.main
  },
  '& .MuiStepLabel-label': {
    cursor: 'pointer'
  },
  [theme.breakpoints.down('md')]: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing(6)
    },
    '& + svg': {
      display: 'none'
    }
  },
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    '&:first-of-type': {
      marginLeft: 0
    },
    '&:last-of-type': {
      marginRight: 0
    }
  }
}))

const RegisterMultiSteps = () => {
  // ** States
  const [activeStep, setActiveStep] = useState<number>(0)
  const router = useRouter()
  const auth = useAuth()
  const [error, setError] = useState('')

  // ** Hooks & Var
  const { settings } = useSettings()
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { direction } = settings

  // Handle Stepper
  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }
  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const [company, setCompany] = useState({
    account_team_size: '1-1',
    account_type: 'CO',
    company_name: '',
    business_type: 'Public Limited Company'
  })

  useEffect(() => {
    auth.setLoading(false)
    // if (auth.user?.company_created) router.replace('/')
  }, [])


  const handleSubmit = () => {
    setError('');
    const authToken = window.localStorage.getItem('accessToken')
    api
      .post(
        '/login/company',
        {
          ...company
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      )
      .then(res => {
          api
            .get(authConfig.meEndpoint)
            .then(response => {
              if (response.data) {
                console.log("userData ", response)
                localStorage.setItem('userData', JSON.stringify(response.data))
                if (!response.data.company_created) {
                  router.replace('/register/company/')
                } else {
                  router.push('/dashboard')
                }
              }
            })
            .catch(e => {
              console.log(e)
              router.push('/login')
            })
      })
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <AccountType handleNext={handleNext} setCompany={setCompany} />
      case 1:
        return <CompanyDetails handlePrev={handlePrev} setCompany={setCompany} handleSubmit={handleSubmit} />

      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  return (
    <>
      <StepperWrapper sx={{ mb: 11.5 }}>
        <Stepper
          activeStep={activeStep}
          sx={{ justifyContent: 'space-between' }}
          connector={
            !smallScreen ? <Icon icon={direction === 'ltr' ? 'tabler:chevron-right' : 'tabler:chevron-left'} /> : null
          }
        >
          {steps.map((step, index) => {
            const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

            return (
              <Step key={index} onClick={() => setActiveStep(index)}>
                <StepLabel>
                  <div className='step-label'>
                    <RenderAvatar
                      variant='rounded'
                      {...(activeStep >= index && { skin: 'light' })}
                      {...(activeStep === index && { skin: 'filled' })}
                      {...(activeStep >= index && { color: 'primary' })}
                      sx={{
                        mr: 4,
                        ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                        ...(activeStep > index && { color: theme => hexToRGBA(theme.palette.primary.main, 0.4) })
                      }}
                    >
                      <Icon fontSize='1.5rem' icon={step.icon} />
                    </RenderAvatar>
                    <div>
                      <Typography variant='h6' className='step-title'>
                        {step.title}
                      </Typography>
                      <Typography className='step-subtitle'>{step.subtitle}</Typography>
                    </div>
                  </div>
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </StepperWrapper>
      {error && (
        <Alert sx={{ mb: 5 }} severity='error'>
          {error}
        </Alert>
      )}
      {renderContent()}

    </>
  )
}

export default RegisterMultiSteps
