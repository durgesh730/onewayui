// ** React Imports
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { MuiOtpInput } from 'mui-one-time-password-input'
import authConfig from 'src/configs/auth'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import AuthIllustrationV1Wrapper from 'src/views/utils/AuthIllustrationV1Wrapper'
import { Alert, Divider } from '@mui/material'
import api from 'src/apiprovider/baseApi'
import { useAuth } from 'src/hooks/useAuth'
import { verifyEmailOTP, sendVerificationEmail } from  'src/apiprovider/authentication/authentication'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const EmailVerify = () => {
  const [resendTime, setResendTime] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const theme = useTheme()

  useEffect(() => {
    sendOtp()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTime(prev => prev - 1)
    }, 1000)

    if (resendTime <= 0) {
      setCanResend(true)
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [resendTime])

  const auth = useAuth()

  const checkOtp = () => {
    setError('')
    const accessToken = localStorage.getItem('accessToken')

    verifyEmailOTP(otp)
      .then(res => {
        api
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          .then(res => {
            localStorage.setItem('userData', JSON.stringify(res.data))
            auth.setUser({ ...res.data })
            router.push('/register/company/')
          })
          .catch(e => {
            setError(e.response.data?.detail || 'Something went wrong')
            console.log(e)
            router.push('/login')
          })
      })
      .catch(e => {
        setError(e.response.data?.detail || 'Something went wrong')
        console.log(e.response)
      })
  }

  const sendOtp = () => {
    const accessToken = localStorage.getItem('accessToken')
    console.log(accessToken)

    sendVerificationEmail()
      .then(res => console.log(res))
      .catch(err => console.log(err.response))
  }

  const [otp, setOtp] = useState('')

  const handleOtpChange = (newValue: string) => {
    setOtp(newValue)
  }

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
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
                />
              </svg>
              <Typography variant='h3' sx={{ ml: 2.5, fontWeight: 700 }}>
                Xinterview
              </Typography>
            </Box>
            <Box sx={{ mb: 0 }}>
              <Typography variant='h4' sx={{ mb: 1.5 }}>
                Verify your email ✉️
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                OTP sent to {router.query?.email}. Please enter the otp below.
              </Typography>
              {error && (
                <Alert sx={{ mb: 5 }} severity='error'>
                  {error}
                </Alert>
              )}
              <Box mt={3} gap={5} display={'flex'} flexDirection={'column'}>
                <MuiOtpInput value={otp} onChange={handleOtpChange} length={6} gap={2} />
                <Button variant='contained' onClick={() => checkOtp()}>
                  Submit
                </Button>
              </Box>
            </Box>
            <Divider sx={{ my: '1rem' }} />
            <Button
              fullWidth
              variant='contained'
              disabled={!canResend}
              onClick={() => {
                setCanResend(false)
                sendOtp()
                setResendTime(60)
              }}
            >
              Resend
            </Button>
            <Typography textAlign='center' marginTop={4}>
              Wait for {resendTime} seconds before resend OTP
            </Typography>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

EmailVerify.guestGuard = true

EmailVerify.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default EmailVerify
