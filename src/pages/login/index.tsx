// ** React Imports
import { useState, ChangeEvent, ReactNode, useContext } from 'react'

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
import { AuthContext } from 'src/context/AuthContext'
import { Alert } from '@mui/material'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { baseUrl } from 'src/apiprovider/baseApi'


interface State {
  password: string
  email: string
  showPassword: boolean
}

// ** Styled Components
const LoginIllustration = styled('video')(({ theme }) => ({
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
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const LoginV2 = () => {
  // ** States
  const [values, setValues] = useState<State>({
    password: '',
    email: '',
    showPassword: false
  })

  const [error, setError] = useState('')
  const { login } = useContext(AuthContext)

  const { executeRecaptcha } = useGoogleReCaptcha()

  async function handleSubmit(e) {
    e.preventDefault()
    const { email, password } = values

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
      if (regex.test(email)) {
        login({ email, password }, (e: any) => {
          setError(e.response?.data.detail)
        })
      } else {
        setError('Not a Valid Email')
      }
    } else {
      setError('ReCaptcha Error')
    }
  }

  // ** Hook
  const theme = useTheme()
  const { settings } = useSettings()

  // ** Vars
  const { skin } = settings
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setError('')
    if (prop === 'email') {
      setValues({ ...values, [prop]: event.target.value.toLowerCase() })
    } else {
      setValues({ ...values, [prop]: event.target.value })
    }
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const videoSource = [
    `${baseUrl}/media/promo/1.mp4`,
    `${baseUrl}/media/promo/2.mp4`,
    `${baseUrl}/media/promo/3.mp4`
  ]

  const randomIndex = Math.floor(Math.random() * videoSource.length)

  const selectedVideoSource = videoSource[randomIndex]

  const regex = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', 'g')

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
          <LoginIllustration autoPlay loop muted>
            <source src={`${selectedVideoSource}`} type='video/mp4' />
          </LoginIllustration>

          <OverlayText>Hire Faster, Hire Smarter</OverlayText>

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
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <image xlinkHref='/images/favicon.png' x='0' y='0' width='32' height='22' />
              {/* <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
              /> */}
            </svg>
            <Box sx={{ my: 3 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                {`Welcome to Xinterview! 👋🏻`}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Please sign-in to your account and start the adventure
              </Typography>
            </Box>
            {error && (
              <Alert sx={{ mb: 3 }} severity='error'>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <CustomTextField
                autoFocus
                fullWidth
                id='email'
                label='Email'
                onChange={handleChange('email')}
                required
                sx={{ display: 'flex', mb: 4 }}
                placeholder='john.doe@gmail.com'
              />
              <CustomTextField
                fullWidth
                sx={{ mb: 1.5 }}
                required
                label='Password'
                placeholder='············'
                value={values.password}
                id='auth-login-v2-password'
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

              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <FormControlLabel control={<Checkbox />} label='Remember Me' />
                <Typography component={LinkStyled} href='/forgot-password'>
                  Forgot Password?
                </Typography>
              </Box>
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Login
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>New on our platform?</Typography>
                <Typography component={LinkStyled} href='/register'>
                  Create an account
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

const LoginWithReCaptcha = () => (
  <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
    <LoginV2 />
  </GoogleReCaptchaProvider>
)

LoginWithReCaptcha.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LoginWithReCaptcha.authGuard = false
LoginWithReCaptcha.guestGuard = true

export default LoginWithReCaptcha
