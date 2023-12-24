// ** React Imports
import { useState, ChangeEvent, ReactNode, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/utils/FooterIllustrationsV2'
import { Alert } from '@mui/material'
import { useRouter } from 'next/router'
import { registerUser } from 'src/apiprovider/authentication/authentication'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import api from 'src/apiprovider/baseApi'
import authConfig from 'src/configs/auth'
import { baseUrl } from 'src/apiprovider/baseApi'


interface State {
  firstName: string
  lastName: string
  workEmail: string | string[]
  password: string
  showPassword: boolean
  accept: boolean
}

// ** Styled Components
const RegisterIllustration = styled('video')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  objectFit: 'cover',
  width: '100%',
  height: '100%',
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: '100%',
    borderRadius: '20px'
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const OverlayText = styled('div')({
  position: 'absolute',
  top: '0%',
  left: '0%',
  width: '100%',
  height: '100%',
  borderRadius: '20px',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 3,
  textAlign: 'right',
  color: '#fff',
  fontSize: '2.6rem',
  paddingBottom: '2rem',
  paddingRight: '2rem',
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'end'
})

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 700
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const RegisterV2 = () => {
  const router = useRouter()
  // ** States
  const { email } = router.query

  const [values, setValues] = useState<State>({
    firstName: '',
    lastName: '',
    workEmail: '',
    password: '',
    accept: false,
    showPassword: false
  })


  const [error, setError] = useState('')
  const regex = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', 'g')

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()

  // ** Vars
  const { skin } = settings
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    if (prop == 'accept') {
      setValues({ ...values, [prop]: event.target.checked })
    } else if (prop === 'workEmail') {
      const lowercaseEmail = event.target.value.toLowerCase()
      setValues({ ...values, [prop]: lowercaseEmail })
    } else setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const { executeRecaptcha } = useGoogleReCaptcha()

  const handleRegister = async () => {
    const { workEmail, firstName, lastName, password } = values

    if (!executeRecaptcha) {
      console.log('not loaded recaptcha, Yet')
      return
    }
    const token = await executeRecaptcha('onSubmit')
    // validate the token via the server action we've created previously
    const verified = await fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })   

    if (verified.ok) {
      // if (values.accept) {
      console.log(email, workEmail)
      const inviteeId = router.query.invite_id
      if (regex.test(workEmail)) {
        registerUser(firstName, lastName, workEmail, password, inviteeId)
          .then(res => {
            if (res.status == 201) {
              localStorage.setItem('accessToken', res.data.access_token)
              localStorage.setItem('refreshToken', res.data.refresh_token)
              router.push({
                  pathname: '/verify-email/',
                  query: {
                    email: res.data.email
                  }
                })
            }
          })
          .catch(e => {
            if (e.response.status === 400) {
              setError(e.response.data.email[0])
              if (e.response.data.email) {
                setError(e.response.data.email[0])
              } else if (e.response.data.password) {
                setError(e.response.data.password[0])
              }
            } else setError(e.response.data?.email[0])
          })
      } else if (email) {
        registerUser(firstName, lastName, email, password, inviteeId)
        .then(res => {
          if (res.status == 201) {
            localStorage.setItem('accessToken', res.data.access_token)
            localStorage.setItem('refreshToken', res.data.refresh_token)
            if (res.data.company_created === true) {
              api
              .get(authConfig.meEndpoint)
              .then(response => {
                if (response.data) {
                  console.log("userData ", response)
                  localStorage.setItem('userData', JSON.stringify(response.data))
                  router.push('/dashboard')
                }
              })
              .catch(e => {
                console.log(e)
                router.push('/login')
              })
            } else {
              router.push({
                pathname: '/verify-email/',
                query: {
                  email: res.data.email
                }
              })
            }
          }
        })
        .catch(e => {
          if (e.response.status === 400) {
            setError(e.response.data.email[0])
            if (e.response.data.email) {
              setError(e.response.data.email[0])
            } else if (e.response.data.password) {
              setError(e.response.data.password[0])
            }
          } else setError(e.response.data?.email[0])
        })
      } else {
        setError('Email is Invalid')
      }
    }
  }

  const videoSource = [
    `${baseUrl}/media/promo/1.mp4`,
    `${baseUrl}/media/promo/2.mp4`,
    `${baseUrl}/media/promo/3.mp4`
  ]

  const randomIndex = Math.floor(Math.random() * videoSource.length)

  const selectedVideoSource = videoSource[randomIndex]

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <RegisterIllustration autoPlay loop muted>
            <source src={`${selectedVideoSource}`} type='video/mp4' />
          </RegisterIllustration>

          <OverlayText>
            The Future of Hiring: <br /> One-Way Interviews
          </OverlayText>
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 420 }}>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                {`Try Xinterview For Free 🚀`}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Start Your 60-Day Trial, No Credit Card Required.
              </Typography>
            </Box>
            {error && (
              <Alert sx={{ mb: 5 }} severity='error'>
                {error}
              </Alert>
            )}
            <form
              autoComplete='off'
              onSubmit={e => {
                e.preventDefault()
                handleRegister()
              }}
            >
              <CustomTextField
                fullWidth
                required
                autoFocus
                id='first-name'
                onChange={handleChange('firstName')}
                label='First Name'
                placeholder='John'
                sx={{ display: 'flex', mb: 4 }}
              />
              <CustomTextField
                fullWidth
                autoFocus
                required
                onChange={handleChange('lastName')}
                id='last-name'
                label='Last Name'
                placeholder='Doe'
                sx={{ display: 'flex', mb: 4 }}
              />
              <CustomTextField
                fullWidth
                type='email'
                value={email && email}
                disabled={email ? true : false}
                required
                onChange={handleChange('workEmail')}
                label='Work Email'
                sx={{ display: 'flex', mb: 4 }}
                placeholder='john.doe@gmail.com'
              />
              <CustomTextField
                fullWidth
                required
                label='Password'
                value={values.password}
                placeholder='············'
                id='auth-register-v2-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                        aria-label='toggle password visibility'
                      >
                        <Icon fontSize='1.25rem' icon={values.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FormControlLabel
                control={<Checkbox checked={values.accept} onChange={handleChange('accept')} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Typography sx={{ color: 'text.secondary' }}>Subscribe to our newsletter sign up </Typography>
                  </Box>
                }
              />
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Sign up
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>
                  By Signing Up, You Agree To Our{' '}
                  <Typography
                    component={LinkStyled}
                    target='_blank'
                    href='https://www.xinterview.co/privacy-policy/'
                    sx={{ fontSize: theme.typography.body1.fontSize }}
                  >
                    Privacy Policy
                  </Typography>
                  {' & '}
                  <Typography
                    component={LinkStyled}
                    target='_blank'
                    href='https://www.xinterview.co/terms-and-conditions/'
                    sx={{ fontSize: theme.typography.body1.fontSize }}
                  >
                    Term Use
                  </Typography>{' '}
                  <br />
                  Already have an account?{' '}
                  <Typography component={LinkStyled} href='/login' sx={{ fontSize: theme.typography.body1.fontSize }}>
                    Sign In
                  </Typography>
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

const RegisterWithReCaptcha = () => (
  <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
    <RegisterV2 />
  </GoogleReCaptchaProvider>
)

RegisterWithReCaptcha.guestGuard = true
RegisterWithReCaptcha.AuthGuard = false

RegisterWithReCaptcha.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterWithReCaptcha
