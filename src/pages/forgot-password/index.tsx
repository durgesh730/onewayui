// ** React Imports
import { ChangeEvent, FormEvent, ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

import FooterIllustrationsV2 from 'src/views/utils/FooterIllustrationsV2'
import { useRouter } from 'next/router'
import { verifyEmail } from 'src/apiprovider/authentication/authentication'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { baseUrl } from 'src/apiprovider/baseApi'

interface State {
  email: string
}

// ** Styled Components
const ForgotIllustration = styled('video')(({ theme }) => ({
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
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: `${theme.palette.primary.main} !important`
}))

const ResetPasswordV2 = () => {
  // ** States
  const [values, setValues] = useState<State>({
    email: ''
  })

  // ** Hooks
  const theme = useTheme()
  const router = useRouter()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // Handle New Password
  const handleEmailChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value.toLowerCase() })
  }

  const { executeRecaptcha } = useGoogleReCaptcha()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

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
      verifyEmail(values.email)
        .then(res => {
          router.push({
            pathname: '/forgot-password/verify-email/',
            query: {
              email: res.email
            }
          })
        })
        .catch(e => console.log(e))
    } else {
      alert('Error with captcha')
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
          <ForgotIllustration autoPlay loop muted>
            <source src={`${selectedVideoSource}`} type='video/mp4' />
          </ForgotIllustration>

          <OverlayText>Discover Talent Beyond Words</OverlayText>
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
              />*/}
            </svg>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Reset Password 🔒
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={e => handleSubmit(e)}>
              <CustomTextField
                autoFocus
                fullWidth
                id='auth-reset-password-v2-new-password'
                label='Email'
                onChange={handleEmailChange('email')}
                required
                type='email'
                sx={{ display: 'flex', mb: 4 }}
                placeholder='john.doe@gmail.com'
              />
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Set New Password
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <Typography component={LinkStyled} href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to login</span>
                </Typography>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

const ResetPasswordWithReCaptcha = () => (
  <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
    <ResetPasswordV2 />
  </GoogleReCaptchaProvider>
)

ResetPasswordWithReCaptcha.guestGuard = false
ResetPasswordWithReCaptcha.authGuard = false
ResetPasswordWithReCaptcha.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ResetPasswordWithReCaptcha
